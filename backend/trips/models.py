from django.db import models
from django.conf import settings

class Trip(models.Model):
    trip_id = models.AutoField(primary_key=True)
    STATUS_CHOICES = (
        ('ONGOING', 'Ongoing'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('SCHEDULED', 'Scheduled'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips')
    vehicle = models.ForeignKey('vehicles.Vehicle', on_delete=models.SET_NULL, null=True, related_name='trips')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    start_location = models.CharField(max_length=255, blank=True)
    end_location = models.CharField(max_length=255, blank=True)
    distance_km = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ONGOING')
    
    # Feedback Fields
    rating = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    alert_helpful = models.BooleanField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'trips'

    def __str__(self):
        return f"Trip {self.trip_id} - {self.user.username} ({self.status})"