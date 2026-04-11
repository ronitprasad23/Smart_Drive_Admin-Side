import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

def get_db_info():
    with connection.cursor() as cursor:
        # Get all tables
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = [row[0] for row in cursor.fetchall()]
        print("--- Tables in Database ---")
        for table in tables:
            print(f"\nTable: {table}")
            # Get columns for each table
            cursor.execute(f"""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = '{table}'
            """)
            for col in cursor.fetchall():
                print(f"  - {col[0]} ({col[1]})")
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            print(f"  - Rows: {cursor.fetchone()[0]}")

if __name__ == "__main__":
    get_db_info()
