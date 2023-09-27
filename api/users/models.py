from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.utils.translation import gettext_lazy as _




class Gym(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    cep = models.CharField(_('CEP'), max_length=10, null=True, blank=True)
    
    def __str__(self):
        return f"{self.name}"


    
class User(AbstractUser):
    name = models.CharField(max_length=1000, null=True, blank=False)  
    email = models.EmailField(_('email address'), blank=False)
    academia = models.ForeignKey(Gym, on_delete=models.SET_NULL, null=True, blank=True)
    groups = models.ManyToManyField(Group, related_name='users', blank=True)
    is_gym_owner = models.BooleanField(default=False)