import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

def check_all():
    with connection.cursor() as cursor:
        # Tables
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [r[0] for r in cursor.fetchall()]
        print(f"Tables in public schema: {tables}")

        for table in ['admins', 'users', 'accounts_user']:
            if table in tables:
                cursor.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}'")
                cols = cursor.fetchall()
                print(f"Columns in '{table}':")
                for col in cols:
                    print(f"  {col[0]} ({col[1]})")
            else:
                print(f"Table '{table}' does NOT exist.")

if __name__ == "__main__":
    check_all()
