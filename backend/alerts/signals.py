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
                                    <td style="background-color: #3b82f6; padding: 30px 20px; text-align: center;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">🚨 Security & Safety Alert</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="font-size: 18px; margin-bottom: 20px; line-height: 1.6; color: #1f2937;">
                                            <strong>Attention Admin,</strong>
                                        </p>
                                        <p style="font-size: 16px; margin-bottom: 25px; line-height: 1.6; color: #4b5563;">
                                            A new <span style="color: #ef4444; font-weight: bold;">{severity_display}</span> has been detected in the system.
                                        </p>
                                        <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
                                            <tr>
                                                <td width="30%" style="font-weight: bold; color: #64748b; border-bottom: 1px solid #e2e8f0;">Vehicle:</td>
                                                <td width="70%" style="font-weight: bold; font-size: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">{vehicle_name}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight: bold; color: #64748b; border-bottom: 1px solid #e2e8f0;">User:</td>
                                                <td style="color: #0f172a; border-bottom: 1px solid #e2e8f0;">{user_name}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight: bold; color: #64748b; border-bottom: 1px solid #e2e8f0;">Alert Type:</td>
                                                <td style="color: #ef4444; font-weight: bold; border-bottom: 1px solid #e2e8f0;">{instance.alert_type}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight: bold; color: #64748b; border-bottom: 1px solid #e2e8f0;">Risk Level:</td>
                                                <td style="color: #ef4444; font-weight: bold; border-bottom: 1px solid #e2e8f0;">{severity_display}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight: bold; color: #64748b; border-bottom: 1px solid #e2e8f0;">Location:</td>
                                                <td style="color: #3b82f6; border-bottom: 1px solid #e2e8f0;">
                                                    <a href="{location_link if instance.latitude else '#'}" style="color: #3b82f6; text-decoration: underline;">View on Map</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight: bold; color: #64748b;">Time:</td>
                                                <td style="color: #0f172a;">{instance.timestamp.strftime('%Y-%m-%d %H:%M:%S')}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #1e293b; padding: 20px; text-align: center;">
                                        <p style="color: #94a3b8; font-size: 14px; margin: 0;">
                                            Smart Drive Alert System<br>
                                            Administrative Notification
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

            from_email = getattr(settings, 'EMAIL_HOST_USER', 'noreply@smartdrive.com')
            admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@smartdrive.com')
            
            send_mail(
                subject,
                message,
                from_email,
                [admin_email],
                fail_silently=False,
                html_message=html_message,
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