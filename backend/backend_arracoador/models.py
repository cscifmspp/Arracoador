# models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True, null=True)
    photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    verification_code_expires = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return self.user.email
    class Meta:
        verbose_name = "Perfil"
        verbose_name_plural = "Perfis"