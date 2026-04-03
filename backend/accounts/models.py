from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    admin_id = models.AutoField(primary_key=True)
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
        db_table = 'admins'
    pass

class EmergencyContact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emergency_contacts')
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    relation = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"