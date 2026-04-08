from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # This is for regular drivers/application users
    full_name = models.CharField(max_length=150, blank=True)
    license_number = models.CharField(max_length=50, blank=True)
    dob = models.DateField(null=True, blank=True)
    persona = models.CharField(max_length=20, default='Normal')
    mobile_number = models.CharField(max_length=20, blank=True)
    emergency_contact = models.CharField(max_length=20, blank=True)
    profile_image = models.TextField(blank=True, null=True)
    issue_date = models.DateField(null=True, blank=True)
    license_type = models.CharField(max_length=20, blank=True)
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.username}"

class AdminUser(AbstractUser):
    # This is specifically for administrative staff/admins
    full_name = models.CharField(max_length=150, blank=True)
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='admin_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='admin_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    class Meta:
        db_table = 'admins'
        verbose_name = 'Administrator'
        verbose_name_plural = 'Administrators'

    def __str__(self):
        return f"{self.username} (Admin)"

class EmergencyContact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emergency_contacts')
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20)
    relation = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"