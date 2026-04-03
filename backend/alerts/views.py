from rest_framework import viewsets, permissions, mixins
from .models import TripAlert, Alert
from .serializers import AlertSerializer, AlertDefinitionSerializer

class UserAlertViewSet(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = AlertSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return TripAlert.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AdminAlertViewSet(viewsets.ModelViewSet):
    queryset = TripAlert.objects.all()
    serializer_class = AlertSerializer
    permission_classes = (permissions.IsAdminUser,)

class AdminAlertDefinitionViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertDefinitionSerializer
    permission_classes = (permissions.IsAdminUser,)