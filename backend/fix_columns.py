import os
import django
from django.db import connection

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

def fix_user_columns():
    with connection.cursor() as cursor:
        # Get existing columns in 'admins' table
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'admins'")
        existing_columns = [row[0] for row in cursor.fetchall()]
        print(f"Existing columns: {existing_columns}")

        # Columns that SHOULD exist according to models.py and migration 0003
        required_columns = {
            'full_name': 'varchar(150) DEFAULT \'\'',
            'license_number': 'varchar(50) DEFAULT \'\'',
            'dob': 'date',
            'persona': 'varchar(20) DEFAULT \'Normal\'',
            'mobile_number': 'varchar(20) DEFAULT \'\'',
            'emergency_contact': 'varchar(20) DEFAULT \'\''
        }

        for col, col_type in required_columns.items():
            if col not in existing_columns:
                print(f"Adding missing column: {col}...")
                cursor.execute(f"ALTER TABLE admins ADD COLUMN {col} {col_type};")
                print(f"Successfully added {col}.")
            else:
                print(f"Column {col} already exists.")

if __name__ == "__main__":
    try:
        fix_user_columns()
        print("\nAll missing columns have been successfully added!")
    except Exception as e:
        print(f"\nAn error occurred: {e}")
