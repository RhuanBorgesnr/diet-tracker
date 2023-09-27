from rest_framework.viewsets import ModelViewSet
from users.models import User
from users.serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from chat.models import Question
from chat.serializers import QuestionSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=False, methods=['GET'])
    def list_users_by_gym(self, request):
        user = request.user
        if user.is_authenticated and user.is_gym_owner:
            users = Question.objects.filter(user__academia_id=user.academia.id, user__is_gym_owner=False)
            serialized_users = QuestionSerializer(users, many=True)
            return Response(serialized_users.data)
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serialized_user = UserSerializer(user)
        return Response(serialized_user.data)
    
  