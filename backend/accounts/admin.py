from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, EmergencyContact

class CustomUserAdmin(UserAdmin):
    # Add the custom fields to the admin detail view
    fieldsets = UserAdmin.fieldsets + (
        ('Driver License Info', {'fields': ('full_name', 'license_number', 'dob', 'issue_date', 'license_type', 'profile_image')}),
        ('Additional Info', {'fields': ('persona', 'mobile_number', 'emergency_contact')}),
    )
    # Add some of these to the list view
    list_display = ('username', 'email', 'full_name', 'license_number', 'license_type', 'is_staff')

admin.site.register(User, CustomUserAdmin)
admin.site.register(EmergencyContact)