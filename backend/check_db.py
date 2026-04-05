import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

def check_columns():
    with connection.cursor() as cursor:
        cursor.execute("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'admins'")
        cols = cursor.fetchall()
        print("Columns in 'admins' table:")
        for col in cols:
            print(f"  {col[0]} ({col[1]}, nullable: {col[2]})")

if __name__ == "__main__":
    check_columns()
