import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

def fix_db():
    with connection.cursor() as cursor:
        print("Dropping 'users' table if it exists...")
        cursor.execute("DROP TABLE IF EXISTS users CASCADE;")
        print("Successfully dropped 'users' table.")

        print("Dropping 'id' column from 'admins' table if it exists...")
        try:
            cursor.execute("ALTER TABLE admins DROP COLUMN IF EXISTS id;")
            print("Successfully dropped 'id' column from 'admins'.")
        except Exception as e:
            print(f"Error dropping 'id' column: {e}")

if __name__ == "__main__":
    fix_db()
