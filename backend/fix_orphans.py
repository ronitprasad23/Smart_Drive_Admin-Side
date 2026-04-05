import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

def fix_orphans():
    # ID of the target user (ronitprasad23)
    target_user_id = 2
    
    # Old orphaned IDs found in diagnostic
    orphaned_ids = [16, 17, 20, 22, 23]
    
    with connection.cursor() as cursor:
        print(f"Updating orphaned records to point to user ID {target_user_id}...")
        
        for table in ['trips', 'vehicles', 'alerts_tripalert', 'accounts_emergencycontact']:
            # Bulk update all orphaned records for these IDs
            # Using WHERE user_id IN (...)
            placeholders = ', '.join(['%s'] * len(orphaned_ids))
            query = f"UPDATE {table} SET user_id = %s WHERE user_id IN ({placeholders})"
            params = [target_user_id] + orphaned_ids
            
            cursor.execute(query, params)
            print(f"  Updated table '{table}': {cursor.rowcount} rows affected.")

if __name__ == "__main__":
    fix_orphans()
