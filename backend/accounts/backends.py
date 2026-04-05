from django.contrib.auth.backends import ModelBackend
from django.db.models import Q
from .models import AdminUser, User

class MultiTableAuthenticationBackend(ModelBackend):
    """
    Custom authentication backend that allows users to log in using 
    either their username or their email address, checking both 
    AdminUser and User tables.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            return None

        # Check in AdminUser table first
        try:
            admin_user = AdminUser.objects.get(Q(username__iexact=username) | Q(email__iexact=username))
            if admin_user.check_password(password) and self.user_can_authenticate(admin_user):
                return admin_user
        except AdminUser.DoesNotExist:
            pass

        # Then check in User table
        try:
            user = User.objects.get(Q(username__iexact=username) | Q(email__iexact=username))
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        except User.DoesNotExist:
            pass

        return None

    def get_user(self, user_id):
        # We need to try both models since we don't know which one user_id belongs to
        try:
            return AdminUser.objects.get(pk=user_id)
        except AdminUser.DoesNotExist:
            try:
                return User.objects.get(pk=user_id)
            except User.DoesNotExist:
                return None
