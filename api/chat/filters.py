import django_filters
from .models import Question

class QuestionFilter(django_filters.FilterSet):
    user = django_filters.CharFilter(method='filter_by_users')

    def filter_by_users(self, queryset, name, value):
        user_ids = value.split(',')
        return queryset.filter(user__in=user_ids)

    class Meta:
        model = Question
        fields = ['user']
