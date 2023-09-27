from django.contrib import admin
from .models import Question

class QuestionAdmin(admin.ModelAdmin):
    list_display = ['user', 'question']
    # Defina as opções do admin para o modelo Question, se necessário

# Registre o modelo QuestionAdmin
admin.site.register(Question, QuestionAdmin)
