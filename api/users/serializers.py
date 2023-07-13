from rest_framework import serializers
from users.models import User
from django.contrib.auth .models import Group

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'name',
            'email',
            'date_joined',
        ]
