from rest_framework import serializers
from .models import Trip

class TripSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    user_details = serializers.SerializerMethodField()
    id = serializers.IntegerField(source='trip_id', read_only=True)
    
    # Allow more flexibility for validation
    vehicle = serializers.PrimaryKeyRelatedField(
        queryset=Trip.vehicle.field.related_model.objects.all(),
        required=False,
        allow_null=True
    )
    start_time = serializers.DateTimeField(required=False, allow_null=True)

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('user', 'created_at',)

    def get_username(self, obj):
        try:
            return obj.user.username
        except:
            return "Unknown User"

    def get_user_details(self, obj):
        try:
            return str(obj.user)
        except:
            return "Unknown User"