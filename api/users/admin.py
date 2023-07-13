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
                    'academia'
                )
            },
        ),
    )
    
    
class GymAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'cep']
    # Defina as opções do admin para o modelo Question, se necessário

# Registre o modelo QuestionAdmin
admin.site.register(Gym)

