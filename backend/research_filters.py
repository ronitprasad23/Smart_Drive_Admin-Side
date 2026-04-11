import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

def research_filtering():
    with connection.cursor() as cursor:
        print("--- Alerts Distribution by User ID ---")
        cursor.execute("SELECT user_id, COUNT(*) FROM alerts_tripalert GROUP BY user_id")
        for row in cursor.fetchall():
            print(f"User ID {row[0]} has {row[1]} alerts")
            
        print("\n--- Trips Distribution by User ID ---")
        cursor.execute("SELECT user_id, COUNT(*) FROM trips GROUP BY user_id")
        for row in cursor.fetchall():
            print(f"User ID {row[0]} has {row[1]} trips")

        print("\n--- Users in Users Table ---")
        cursor.execute("SELECT id, username FROM users")
        for row in cursor.fetchall():
            print(f"ID {row[0]}: {row[1]}")

if __name__ == "__main__":
    research_filtering()
