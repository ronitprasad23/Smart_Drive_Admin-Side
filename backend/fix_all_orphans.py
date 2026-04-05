import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

def fix_all_orphans():
    # ID of the target user (ronitprasad23)
    target_user_id = 2
    
    with connection.cursor() as cursor:
        # Get all valid user IDs
        cursor.execute("SELECT id FROM users")
        valid_ids = [r[0] for r in cursor.fetchall()]
        
        for table in ['trips', 'vehicles', 'alerts_tripalert', 'accounts_emergencycontact']:
            # Find current orphans in the table
            cursor.execute(f"SELECT DISTINCT user_id FROM {table}")
            all_uids = [r[0] for r in cursor.fetchall()]
            current_orphans = [uid for uid in all_uids if uid not in valid_ids]
            
            if current_orphans:
                print(f"Updating orphaned IDs {current_orphans} in '{table}' to {target_user_id}...")
                placeholders = ', '.join(['%s'] * len(current_orphans))
                query = f"UPDATE {table} SET user_id = %s WHERE user_id IN ({placeholders})"
                params = [target_user_id] + current_orphans
                cursor.execute(query, params)
                print(f"  Affected: {cursor.rowcount} rows.")
            else:
                print(f"Table '{table}' is already clean.")

if __name__ == "__main__":
    fix_all_orphans()
