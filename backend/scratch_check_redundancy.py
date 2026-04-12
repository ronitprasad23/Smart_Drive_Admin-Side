import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

from alerts.models import Alert, TripAlert

def check_redundancy():
    print("--- Alert Types (Alert model) ---")
    alerts = Alert.objects.all().order_by('id')
    for a in alerts:
        usage_count = TripAlert.objects.filter(alert_type=a).count()
        print(f"ID: {a.id} | Name: '{a.name}' | Usage in TripAlert: {usage_count} | Description: {a.description}")

if __name__ == "__main__":
    check_redundancy()
