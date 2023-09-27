from django.urls import include, path
from rest_framework import routers
from chat import views

router = routers.DefaultRouter()
router.register(r'questions', views.QuestionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('questions/<int:pk>/update_weight/', views.QuestionViewSet.as_view({'put': 'update_weight'}), name='question-update-weight'),

]
