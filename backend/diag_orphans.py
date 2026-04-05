import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

def diag():
    with connection.cursor() as cursor:
        # Get all valid user IDs
        cursor.execute("SELECT id FROM users")
        valid_ids = [r[0] for r in cursor.fetchall()]
        print(f"Valid user IDs: {valid_ids}")

        for table in ['trips', 'vehicles', 'alerts_tripalert', 'accounts_emergencycontact']:
            # Check for orphaned records
            cursor.execute(f"SELECT DISTINCT user_id FROM {table}")
            user_ids = [r[0] for r in cursor.fetchall()]
            orphans = [uid for uid in user_ids if uid not in valid_ids]
            if orphans:
                print(f"Table '{table}' has orphaned user_id values: {orphans}")
            else:
                print(f"Table '{table}' is clean.")

if __name__ == "__main__":
    diag()
