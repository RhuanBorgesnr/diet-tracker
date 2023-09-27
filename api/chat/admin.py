from django.contrib import admin
from .models import Question, WeightLossHistory

class QuestionAdmin(admin.ModelAdmin):
    list_display = ['user', 'question']

class WeightLossHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'weight', 'weight_loss']



admin.site.register(Question, QuestionAdmin)
admin.site.register(WeightLossHistory, WeightLossHistoryAdmin)

