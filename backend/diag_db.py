import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

def run_diagnostics():
    tables = ['admins', 'users', 'trips', 'vehicles', 'alerts_alert', 'alerts_tripalert']
    print("--- Database Diagnostics ---")
    with connection.cursor() as cursor:
        for table in tables:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"Table '{table}': {count} rows")
            except Exception as e:
                print(f"Table '{table}': Error - {str(e)}")
                
        # Check if 'trips' references 'admins' or 'users'
        try:
            cursor.execute("""
                SELECT
                    tc.table_name, kcu.column_name, 
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name 
                FROM 
                    information_schema.table_constraints AS tc 
                    JOIN information_schema.key_column_usage AS kcu
                      ON tc.constraint_name = kcu.constraint_name
                    JOIN information_schema.constraint_column_usage AS ccu
                      ON ccu.constraint_name = tc.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='trips';
            """)
            fks = cursor.fetchall()
            print("\nForeign Keys in 'trips' table:")
            for fk in fks:
                print(f"  {fk[1]} -> {fk[2]}({fk[3]})")
        except Exception as e:
            print(f"Error checking FKs: {str(e)}")

if __name__ == "__main__":
    run_diagnostics()
