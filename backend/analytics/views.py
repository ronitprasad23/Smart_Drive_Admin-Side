from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth, TruncDay
from accounts.models import User
from trips.models import Trip
from alerts.models import TripAlert, Alert
from django.http import HttpResponse
from .ai_service import generate_safety_feedback
from .reports_generator import SafetyReportGenerator

class OverviewView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if request.user.is_staff:
            recent_alerts_qs = TripAlert.objects.all().order_by('-timestamp')[:5]
            recent_alerts = []
            for alert in recent_alerts_qs:
                recent_alerts.append({
                    'id': alert.id,
                    'user': alert.user.username,
                    'type': alert.alert_type.name,
                    'location': alert.location or "Unknown",
                    'severity': alert.severity,
                    'status': 'Critical' if alert.severity == 'CRITICAL_RISK' else ('Warning' if alert.severity == 'MODERATE_RISK' else 'Safe')
                })

            data = {
                'total_users': User.objects.count(),
                'total_trips': Trip.objects.count(),
                'total_alerts': TripAlert.objects.count(),
                'total_accident_zones': 0,
                'recent_alerts': recent_alerts
            }
        else:
            data = {
                'total_trips': Trip.objects.filter(user=request.user).count(),
                'total_alerts': TripAlert.objects.filter(user=request.user).count(),
            }
        return Response(data)

class AlertsSummaryView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        qs = TripAlert.objects.all()
        if not request.user.is_staff:
            qs = qs.filter(user=request.user)

        summary = qs.values('severity').annotate(count=Count('severity'))
        return Response(summary)

class RiskTrendsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        data = {
            "dates": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "risk_scores": [12, 19, 3, 5, 2, 3, 15],
            "message": "Risk trend analysis based on alert frequency per day."
        }
        return Response(data)

class TripFeedbackView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, trip_id):
        try:
            trip = Trip.objects.get(trip_id=trip_id)
        except Trip.DoesNotExist:
            return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)

        if not request.user.is_staff and trip.user != request.user:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        alerts = TripAlert.objects.filter(trip=trip)
        feedback = generate_safety_feedback(trip, alerts)

        return Response({
            "trip_id": trip.id,
            "analysis": feedback
        })

class ReportsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_report_data(self, driver_id, vehicle_id):
        from django.db import connection

        # Filter construction for named parameters (Explicitly aliased)
        at_filters = []  # for alerts_tripalert (at)
        t_filters = []   # for trips (t)
        sql_params = {}
        
        if driver_id and driver_id != 'all':
            at_filters.append("at.user_id = %(u_id)s")
            t_filters.append("t.user_id = %(u_id)s")
            sql_params['u_id'] = driver_id
        
        if vehicle_id and vehicle_id != 'all':
            at_filters.append("at.trip_id IN (SELECT trip_id FROM trips WHERE vehicle_id = %(v_id)s)")
            t_filters.append("t.vehicle_id = %(v_id)s")
            sql_params['v_id'] = vehicle_id

        at_where = ("WHERE " + " AND ".join(at_filters)) if at_filters else ""
        t_where = ("WHERE " + " AND ".join(t_filters)) if t_filters else ""

        with connection.cursor() as cursor:
            # 1. KPI Stats
            cursor.execute(f"SELECT COUNT(*) FROM alerts_tripalert at {at_where}", sql_params)
            total_alerts = cursor.fetchone()[0]
            
            cursor.execute(f"SELECT COUNT(*) FROM trips t {t_where}", sql_params)
            total_trips = cursor.fetchone()[0]
            
            cursor.execute(f"SELECT COUNT(DISTINCT t.user_id) FROM trips t {t_where}", sql_params)
            active_drivers = cursor.fetchone()[0]
            
            # Critical alerts count
            crit_where = (at_where + " AND at.severity = 'CRITICAL_RISK'") if at_where else "WHERE at.severity = 'CRITICAL_RISK'"
            cursor.execute(f"SELECT COUNT(*) FROM alerts_tripalert at {crit_where}", sql_params)
            critical_alerts = cursor.fetchone()[0]

            # 2. Alerts by Type
            cursor.execute(f"""
                SELECT aa.name, COUNT(at.id) as count 
                FROM alerts_tripalert at 
                JOIN alerts_alert aa ON at.alert_type_id = aa.id 
                {at_where}
                GROUP BY aa.name ORDER BY count DESC
            """, sql_params)
            alerts_by_type = [{"name": row[0], "count": row[1]} for row in cursor.fetchall()]

            # 3. Alert Severity breakdown
            cursor.execute(f"SELECT at.severity, COUNT(*) FROM alerts_tripalert at {at_where} GROUP BY at.severity", sql_params)
            severity_summary = cursor.fetchall()
            severity_map = {'CRITICAL_RISK': 'High', 'MODERATE_RISK': 'Medium', 'MINOR_RISK': 'Low'}
            severity_counts = {'High': 0, 'Medium': 0, 'Low': 0}
            for row in severity_summary:
                label = severity_map.get(row[0], 'Low')
                severity_counts[label] += row[1]

            # 4. Monthly Trends
            cursor.execute(f"""
                SELECT TO_CHAR(at.timestamp, 'Mon') as month, COUNT(*) as count 
                FROM alerts_tripalert at
                {at_where}
                GROUP BY month
            """, sql_params)
            alert_trends = {row[0]: row[1] for row in cursor.fetchall()}

            cursor.execute(f"""
                SELECT TO_CHAR(t.start_time, 'Mon') as month, COUNT(*) as count 
                FROM trips t
                {t_where}
                GROUP BY month
            """, sql_params)
            trip_trends = {row[0]: row[1] for row in cursor.fetchall()}

            months_order = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            trends = []
            for m in months_order:
                if m in alert_trends or m in trip_trends:
                    trends.append({
                        'name': m,
                        'trips': trip_trends.get(m, 0),
                        'alerts': alert_trends.get(m, 0)
                    })

            # 5. Recent Alerts
            cursor.execute(f"""
                SELECT at.id, u.username, v.model, aa.name, at.location, TO_CHAR(at.timestamp, 'DD Mon, HH12:MI AM'), at.severity
                FROM alerts_tripalert at
                JOIN users u ON at.user_id = u.id
                LEFT JOIN trips t ON at.trip_id = t.trip_id
                LEFT JOIN vehicles v ON t.vehicle_id = v.vehicle_id
                JOIN alerts_alert aa ON at.alert_type_id = aa.id
                {at_where}
                ORDER BY at.timestamp DESC LIMIT 10
            """, sql_params)
            recent_events = [{
                'id': row[0],
                'name': row[1],
                'vehicle': row[2] or "Generic Vehicle",
                'type': row[3],
                'location': row[4] or "Unknown Route",
                'time': row[5],
                'severity': severity_map.get(row[6], 'Low')
            } for row in cursor.fetchall()]

            # Metadata
            cursor.execute("SELECT id, username FROM users")
            drivers = [{"id": row[0], "username": row[1]} for row in cursor.fetchall()]
            
            vehicle_meta_where = ""
            vehicle_meta_params = {}
            if driver_id and driver_id != 'all':
                vehicle_meta_where = "WHERE user_id = %(u_id)s"
                vehicle_meta_params = {'u_id': driver_id}
            cursor.execute(f"SELECT vehicle_id, model, license_plate, user_id FROM vehicles {vehicle_meta_where}", vehicle_meta_params)
            vehicles = [{"id": row[0], "model": row[1], "plate_number": row[2], "user_id": row[3]} for row in cursor.fetchall()]

            # 6. Map Points (Geospatial data for pinpointing)
            cursor.execute(f"""
                SELECT at.latitude, at.longitude, aa.name, at.severity, at.location
                FROM alerts_tripalert at
                JOIN alerts_alert aa ON at.alert_type_id = aa.id
                {at_where}
                AND at.latitude IS NOT NULL AND at.longitude IS NOT NULL
            """, sql_params)
            map_points = [{
                'lat': float(row[0]),
                'lng': float(row[1]),
                'type': row[2],
                'severity': severity_map.get(row[3], 'Low'),
                'location': row[4]
            } for row in cursor.fetchall()]

        return {
            'kpis': {
                'total_alerts': total_alerts,
                'total_trips': total_trips,
                'active_drivers': active_drivers,
                'critical_alerts': critical_alerts,
            },
            'alerts_by_type': alerts_by_type,
            'severity_data': [{'name': k, 'value': v} for k, v in severity_counts.items()],
            'trends': trends,
            'recent_events': recent_events,
            'map_points': map_points,
            'metadata': {
                'drivers': drivers,
                'vehicles': vehicles
            }
        }

    def get(self, request):
        if not request.user.is_staff:
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

        # Get filters from query params
        driver_id = request.query_params.get('driver')
        vehicle_id = request.query_params.get('vehicle')

        try:
            data = self.get_report_data(driver_id, vehicle_id)
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReportPDFView(ReportsView):
    def get(self, request):
        if not request.user.is_staff:
            return HttpResponse("Unauthorized", status=403)

        driver_id = request.query_params.get('driver')
        vehicle_id = request.query_params.get('vehicle')

        try:
            data = self.get_report_data(driver_id, vehicle_id)
            
            # Determine report type for header
            report_type = "Fleet Overview Report"
            if driver_id and driver_id != 'all':
                # Try to get username if single driver
                for d in data['metadata']['drivers']:
                    if str(d['id']) == str(driver_id):
                        report_type = f"Driver Report: {d['username']}"
                        break
            
            generator = SafetyReportGenerator(data, report_type=report_type)
            pdf_content = generator.generate()
            
            response = HttpResponse(pdf_content, content_type='application/pdf')
            filename = f"SmartDrive_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
            
        except Exception as e:
            return HttpResponse(f"Error generating PDF: {str(e)}", status=500)