import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

from alerts.models import Alert, TripAlert

def consolidate():
    target_name = 'Drowsiness Detected'
    redundant_names = ['Drowsy', 'Sleep', 'Drowsiness']
    
    # 1. Get or create the main professional alert
    target_obj, created = Alert.objects.get_or_create(name=target_name)
    if not target_obj.description:
        target_obj.description = "Alert triggered when the AI detects signs of driver fatigue, such as prolonged eye closure or frequent yawning."
        target_obj.save()
    
    print(f"Target Alert Type: '{target_name}' (ID: {target_obj.id})")
    
    # 2. Re-link TripAlerts
    for red_name in redundant_names:
        try:
            red_obj = Alert.objects.get(name=red_name)
            usage = TripAlert.objects.filter(alert_type=red_obj).count()
            print(f"Consolidating '{red_name}'... Found {usage} alerts.")
            
            TripAlert.objects.filter(alert_type=red_obj).update(alert_type=target_obj)
            
            # 3. Delete the redundant type
            red_obj.delete()
            print(f"Deleted redundant type: '{red_name}'")
        except Alert.DoesNotExist:
            print(f"Redundant type '{red_name}' not found or already deleted.")

    print("\n--- Summary ---")
    final_usage = TripAlert.objects.filter(alert_type=target_obj).count()
    print(f"Total '{target_name}' alerts now: {final_usage}")

if __name__ == "__main__":
    consolidate()
