from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='vehicle_id', read_only=True)
    user_details = serializers.StringRelatedField(source='user', read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ['user']

