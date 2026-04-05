from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import EmergencyContact, AdminUser, User
from .serializers import (
    UserSerializer, AdminUserSerializer, 
    RegisterSerializer, EmergencyContactSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_admin'] = getattr(user, 'is_staff', False)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        if not getattr(self.user, 'is_staff', False):
             raise serializers.ValidationError("User is not an admin.")
        return data

class AdminLoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        # We manually authenticate here to ensure we check the AdminUser table
        username = request.data.get('username')
        password = request.data.get('password')
        
        from django.contrib.auth import authenticate
        user = authenticate(username=username, password=password)
        
        if user is not None and isinstance(user, AdminUser):
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_admin': True
            }, status=status.HTTP_200_OK)
        
        # Fallback to checking regular User if it's a staff member
        if user is not None and isinstance(user, User) and user.is_staff:
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_admin': True
            }, status=status.HTTP_200_OK)
        
        return Response({"detail": "Invalid admin credentials."}, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_serializer_class(self):
        if isinstance(self.request.user, AdminUser):
            return AdminUserSerializer
        return UserSerializer

    def get_object(self):
        return self.request.user

class EmergencyContactViewSet(viewsets.ModelViewSet):
    serializer_class = EmergencyContactSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = AdminUser.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get_queryset(self):
        # We still return AdminUser as default for other actions
        return AdminUser.objects.all()

    def list(self, request, *args, **kwargs):
        # Return both Admins and Regular Users
        admins = AdminUser.objects.all()
        users = User.objects.all()
        
        admin_serializer = AdminUserSerializer(admins, many=True)
        user_serializer = UserSerializer(users, many=True)
        
        return Response(admin_serializer.data + user_serializer.data)

    def get_object(self):
        pk = self.kwargs.get('pk')
        try:
            return AdminUser.objects.get(pk=pk)
        except AdminUser.DoesNotExist:
            return User.objects.get(pk=pk)

    def create(self, request, *args, **kwargs):
        return Response({"detail": "Manual user creation is disabled. Users must register via the application."}, 
                        status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def perform_destroy(self, instance):
        try:
            from django.contrib.admin.models import LogEntry
            from django.contrib.contenttypes.models import ContentType

            ct = ContentType.objects.get_for_model(instance)
            LogEntry.objects.filter(object_id=instance.pk, content_type=ct).delete()
            LogEntry.objects.filter(user_id=instance.pk).delete()

            instance.delete()
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise e

class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response({"error": "Old and new password required"}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({"error": "Wrong old password"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
