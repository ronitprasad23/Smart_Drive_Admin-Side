from rest_framework import serializers
from .models import TripAlert, Alert

class AlertSerializer(serializers.ModelSerializer):
    alert_type = serializers.CharField(source='alert_type.name')

    class Meta:
        model = TripAlert
        fields = '__all__'
        read_only_fields = ('user', 'timestamp')

    def create(self, validated_data):
        alert_name = validated_data.pop('alert_type')['name']
        alert_obj, _ = Alert.objects.get_or_create(name=alert_name)
        validated_data['alert_type'] = alert_obj
        return super().create(validated_data)
    
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if not data.get('location') and instance.trip:
            data['location'] = instance.trip.start_location or "Trip Location"
        return data

    vehicle_name = serializers.SerializerMethodField()

    def get_vehicle_name(self, obj):
        if obj.trip and obj.trip.vehicle:
            return str(obj.trip.vehicle)
        return "Unknown Vehicle"

class AlertDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'