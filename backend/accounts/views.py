from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import EmergencyContact, AdminUser, User
from .serializers import (
    UserSerializer, AdminUserSerializer, 
    RegisterSerializer, EmergencyContactSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_admin'] = getattr(user, 'is_staff', False)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        if not getattr(self.user, 'is_staff', False):
             raise serializers.ValidationError("User is not an admin.")
        return data

class AdminLoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        # We manually authenticate here to ensure we check the AdminUser table
        username = request.data.get('username')
        password = request.data.get('password')
        
        from django.contrib.auth import authenticate
        user = authenticate(username=username, password=password)
        
        if user is not None and isinstance(user, AdminUser):
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_admin': True
            }, status=status.HTTP_200_OK)
        
        # Fallback to checking regular User if it's a staff member
        if user is not None and isinstance(user, User) and user.is_staff:
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_admin': True
            }, status=status.HTTP_200_OK)
        
        return Response({"detail": "Invalid admin credentials."}, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_serializer_class(self):
        if isinstance(self.request.user, AdminUser):
            return AdminUserSerializer
        return UserSerializer

    def get_object(self):
        return self.request.user

class EmergencyContactViewSet(viewsets.ModelViewSet):
    serializer_class = EmergencyContactSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = AdminUser.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get_queryset(self):
        # We still return AdminUser as default for other actions
        return AdminUser.objects.all()

    def list(self, request, *args, **kwargs):
        # Return both Admins and Regular Users
        admins = AdminUser.objects.all()
        users = User.objects.all()
        
        admin_serializer = AdminUserSerializer(admins, many=True)
        user_serializer = UserSerializer(users, many=True)
        
        return Response(admin_serializer.data + user_serializer.data)

    def get_object(self):
        pk = self.kwargs.get('pk')
        try:
            return AdminUser.objects.get(pk=pk)
        except AdminUser.DoesNotExist:
            return User.objects.get(pk=pk)

    def create(self, request, *args, **kwargs):
        return Response({"detail": "Manual user creation is disabled. Users must register via the application."}, 
                        status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def perform_destroy(self, instance):
        try:
            from django.contrib.admin.models import LogEntry
            from django.contrib.contenttypes.models import ContentType

            ct = ContentType.objects.get_for_model(instance)
            LogEntry.objects.filter(object_id=instance.pk, content_type=ct).delete()
            LogEntry.objects.filter(user_id=instance.pk).delete()

            instance.delete()
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise e

class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response({"error": "Old and new password required"}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({"error": "Wrong old password"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

class SendEmergencyAlertView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user
        contacts = EmergencyContact.objects.filter(user=user)
        
        # Comprehensive report data
        dispatch_report = {
            "summary": {
                "total_contacts": contacts.count(),
                "emails_successful": 0,
                "missing_emails": 0,
                "real_sms_sent": 0,
                "simulated_sms": 0,
                "total_errors": 0
            },
            "contact_details": []
        }

        alert_type = request.data.get('alert_type', 'URGENT SOS')
        location = request.data.get('location', 'Unknown location')
        
        subject = f"CRITICAL SOS ALERT: {user.get_full_name() or user.username} is Unresponsive!"
        
        message = f"""
EMERGENCY ALERT (Smart Drive)

A critical safety event has been triggered.
Driver: {user.get_full_name() or user.username}
Reason: {alert_type}
Location: {location}

Please contact the driver immediately.
"""

        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding: 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <tr>
                                <td style="background-color: #ef4444; padding: 30px 20px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">🚨 EMERGENCY SOS ALERT 🚨</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="font-size: 18px; margin-bottom: 20px; line-height: 1.6; color: #1f2937;">
                                        <strong style="color: #ef4444; font-size: 20px;">CRITICAL SAFETY EVENT TRIGGERED</strong>
                                    </p>
                                    <p style="font-size: 16px; margin-bottom: 25px; line-height: 1.6; color: #4b5563;">
                                        Please review the details below and contact the driver immediately. This is an automated emergency dispatch from the Smart Drive system.
                                    </p>
                                    <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
                                        <tr>
                                            <td width="30%" style="font-weight: bold; color: #64748b; border-bottom: 1px solid #e2e8f0;">Driver Name:</td>
                                            <td width="70%" style="font-weight: bold; font-size: 18px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">{user.get_full_name() or user.username}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: bold; color: #64748b; border-bottom: 1px solid #e2e8f0;">Alert Reason:</td>
                                            <td style="font-weight: bold; color: #ef4444; border-bottom: 1px solid #e2e8f0;">{alert_type}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: bold; color: #64748b;">Location:</td>
                                            <td style="color: #0f172a;">{location}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: #1e293b; padding: 20px; text-align: center;">
                                    <p style="color: #94a3b8; font-size: 14px; margin: 0;">
                                        Powered by <strong>Smart Drive Safety Engine</strong><br>
                                        Automated Emergency Dispatcher
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        from django.core.mail import send_mail
        from django.conf import settings
        import os

        # Twilio Config
        sid = os.environ.get('TWILIO_ACCOUNT_SID')
        token = os.environ.get('TWILIO_AUTH_TOKEN')
        t_num = os.environ.get('TWILIO_PHONE_NUMBER')
        
        sms_client = None
        if sid and token:
            try:
                from twilio.rest import Client
                sms_client = Client(sid, token)
            except Exception as e:
                print(f"[SOS DIAG] Twilio Init Error: {e}")

        # Dispatch Loop
        for contact in contacts:
            c_report = {
                "name": contact.name,
                "email_status": "N/A",
                "sms_status": "N/A",
                "errors": []
            }
            
            # --- Email Dispatch ---
            c_email = getattr(contact, 'email', None)
            
            if c_email and c_email.strip():
                try:
                    send_mail(
                        subject,
                        message,
                        settings.DEFAULT_FROM_EMAIL,
                        [c_email],
                        fail_silently=False,
                        html_message=html_message,
                    )
                    c_report["email_status"] = "SENT"
                    dispatch_report["summary"]["emails_successful"] += 1
                except Exception as e:
                    c_report["email_status"] = "FAILED"
                    c_report["errors"].append(f"Email Error: {str(e)}")
                    dispatch_report["summary"]["total_errors"] += 1
            else:
                c_report["email_status"] = "MISSING INFO"
                c_report["errors"].append("No Email Address saved for this contact.")
                dispatch_report["summary"]["missing_emails"] += 1

            # --- SMS Dispatch ---
            if contact.phone_number:
                if sid and token:
                    try:
                        from twilio.rest import Client
                        client = Client(sid, token)
                        
                        # Validate Twilio From Number format
                        from_num = t_num
                        if from_num and not str(from_num).startswith('+'):
                            from_num = f"+{from_num}"

                        client.messages.create(
                            body=message,
                            from_=from_num,
                            to=contact.phone_number
                        )
                        c_report["sms_status"] = "SENT"
                        dispatch_report["summary"]["real_sms_sent"] += 1
                    except ImportError:
                        c_report["sms_status"] = "FAILED"
                        c_report["errors"].append("Twilio library not installed. Run 'pip install twilio'.")
                        dispatch_report["summary"]["total_errors"] += 1
                    except Exception as e:
                        import re
                        raw_error = str(e)
                        # Strip ANSI escape codes (e.g. [31m)
                        clean_error = re.sub(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])', '', raw_error)
                        
                        c_report["sms_status"] = "FAILED"
                        c_report["errors"].append(f"SMS Provider Error: {clean_error}")
                        dispatch_report["summary"]["total_errors"] += 1
                else:
                    # Simulation / Key missing
                    c_report["sms_status"] = "SIMULATED (No Twilio Keys)"
                    dispatch_report["summary"]["simulated_sms"] += 1
            else:
                c_report["sms_status"] = "MISSING INFO"
                c_report["errors"].append("No Phone Number saved for this contact.")

            dispatch_report["contact_details"].append(c_report)

        # Final validation for return
        if not contacts.exists():
            return Response({
                "detail": "No emergency contacts found. Please add contacts in the App first.",
                "report": dispatch_report
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "detail": "SOS Dispatch Processed.",
            "report": dispatch_report
        }, status=status.HTTP_200_OK)
