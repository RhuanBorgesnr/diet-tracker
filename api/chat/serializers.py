
from rest_framework import serializers
from chat.models import Question, WeightLossHistory

class QuestionSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.username', read_only=True)
    nome_completo = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = Question
        fields = '__all__'




class ProgressChartSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = WeightLossHistory
        fields = ['weight', 'name', 'weight_loss', 'user', 'date']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        action = self.context.get('action')
        if action == 'group_graph':
            idealWeight = data['weight'] - data['weight_loss']
            formatted_data = {
                'date': 'Mês {}'.format(instance.date),
                'currentWeight': data['weight'],
                'idealWeight': idealWeight
            }
            return formatted_data
