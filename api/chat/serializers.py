
from rest_framework import serializers
from chat.models import Question

class QuestionSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Question
        fields = '__all__'




class ProgressChartSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Question
        fields = ['name', 'question', 'answer', 'weight', 'weight_loss', 'user', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        action = self.context.get('action')
        if action == 'group_graph':
            idealWeight = data['weight'] - data['weight_loss']
            formatted_data = {
                'date': 'Mês {}'.format(instance.created_at),
                'currentWeight': data['weight'],
                'idealWeight': idealWeight
            }
            return formatted_data
