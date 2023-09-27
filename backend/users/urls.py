from rest_framework import routers

from users.views import UserViewSet, UserDetailView

from django.urls import include, path


from rest_framework_jwt.views import obtain_jwt_token


router = routers.SimpleRouter(trailing_slash=False)

router.register('users', UserViewSet, basename='user')



urlpatterns = [
    path('login/', obtain_jwt_token),
    path('users/me/', UserDetailView.as_view(), name='user-detail')
] + router.urls

