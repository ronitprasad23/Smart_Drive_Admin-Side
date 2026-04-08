from rest_framework import viewsets, permissions, mixins
from .models import Trip
from .serializers import TripSerializer

class TripViewSet(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = TripSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).order_by('-trip_id')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AdminTripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = (permissions.IsAdminUser,)