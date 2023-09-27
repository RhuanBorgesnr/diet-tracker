from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import User, Gym


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        (
            None,
            {
                'fields': ( 
                    'name',
                    'academia',
                    'is_gym_owner'
                    
                )
            },
        ),
    )
    
    
class GymAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'cep']
    

        
        
    


admin.site.register(Gym)

