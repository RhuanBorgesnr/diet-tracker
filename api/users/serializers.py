from rest_framework import serializers
from users.models import User
from django.contrib.auth .models import Group

class UserSerializer(serializers.ModelSerializer):
    gyn_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'name',
            'email',
            'date_joined',
            'academia',
            'is_gym_owner',
            'groups',
            'gyn_name'
            
        ]
        
        
    def get_gyn_name(self, obj):
        if obj.academia and obj.academia.name:
            return obj.academia.name
        return None 
        
        
