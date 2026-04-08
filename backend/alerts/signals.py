from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import TripAlert
from system_settings.models import SystemSetting
import os

@receiver(post_save, sender=TripAlert)
def send_alert_notifications(sender, instance, created, **kwargs):
    """
    Triggers email and/or SMS notifications to the admin when a critical alert is created.
    """
    if not created:
        return

    # Check for the correct severity choices defined in the model
    # Usually we notify for serious issues
    if instance.severity not in ['CRITICAL_RISK', 'MODERATE_RISK', 'CRITICAL', 'HIGH']:
        return

    # Fetch settings
    try:
        email_alerts_setting = SystemSetting.objects.filter(key='email_alerts').first()
        sms_alerts_setting = SystemSetting.objects.filter(key='sms_alerts').first()
        admin_phone_setting = SystemSetting.objects.filter(key='admin_phone').first()

        email_alerts_enabled = email_alerts_setting.value.lower() == 'true' if email_alerts_setting else True
        sms_alerts_enabled = sms_alerts_setting.value.lower() == 'true' if sms_alerts_setting else False
        
        # Priority: Environment variable > System Setting
        admin_phone = os.environ.get('ADMIN_ALERT_RECIPIENT_PHONE')
        if not admin_phone and admin_phone_setting:
            admin_phone = admin_phone_setting.value
    except Exception as e:
        print(f"⚠️ Error fetching system settings in signal: {e}")
        email_alerts_enabled = True
        sms_alerts_enabled = False
        admin_phone = None

    user_name = instance.user.username if instance.user else "Unknown User"
    vehicle_name = str(instance.trip.vehicle) if instance.trip and instance.trip.vehicle else "Unknown Vehicle"
    location_link = f"https://www.google.com/maps/search/?api=1&query={instance.latitude},{instance.longitude}"
    
    severity_display = instance.get_severity_display()
    
    # 1. --- EMAIL ALERT ---
    if email_alerts_enabled:
        try:
            subject = f"[Smart Drive] 🚨 {severity_display} Alert: {instance.alert_type}"
            
            message = f"""
            Attention Admin,

            A new {severity_display} has been detected.

            --------------------------------------------------
            🚗 Vehicle: {vehicle_name}
            👤 User: {user_name}
            🚨 Type: {instance.alert_type}
            ⚡ Risk Level: {severity_display}
            --------------------------------------------------

            📍 Location: {location_link if instance.latitude else "Location data unavailable"}
            
            Time: {instance.timestamp.strftime('%Y-%m-%d %H:%M:%S')}

            Please take necessary action.

            - Smart Drive Alert System
            """

            from_email = getattr(settings, 'EMAIL_HOST_USER', 'noreply@smartdrive.com')
            admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@smartdrive.com')
            
            send_mail(
                subject,
                message,
                from_email,
                [admin_email],
                fail_silently=False,
            )
            print(f"📧 Email Alert Sent to {admin_email}")
        except Exception as e:
            print(f"❌ Failed to send email alert: {e}")

    # 2. --- SMS ALERT ---
    if sms_alerts_enabled and admin_phone:
        try:
            sid = os.environ.get('TWILIO_ACCOUNT_SID')
            token = os.environ.get('TWILIO_AUTH_TOKEN')
            from_num = os.environ.get('TWILIO_PHONE_NUMBER')

            if sid and token and from_num:
                from twilio.rest import Client
                client = Client(sid, token)

                # Format Twilio From Number
                if from_num and not str(from_num).startswith('+'):
                    from_num = f"+{from_num}"
                
                # Format Admin To Number
                to_num = admin_phone
                if to_num and not str(to_num).startswith('+'):
                    # Defaulting to some country code if missing might be risky, but let's assume they provide it or we prefix +
                    to_num = f"+{to_num}"

                sms_body = f"🚨 Smart Drive Alert!\nSeverity: {severity_display}\nType: {instance.alert_type}\nUser: {user_name}\nVehicle: {vehicle_name}\nLoc: {location_link if instance.latitude else 'N/A'}"

                client.messages.create(
                    body=sms_body,
                    from_=from_num,
                    to=to_num
                )
                print(f"📱 SMS Alert Sent to {to_num}")
            else:
                print("⚠️ SMS alert enabled but Twilio credentials missing in environment.")
        except Exception as e:
            print(f"❌ Failed to send SMS alert: {e}")