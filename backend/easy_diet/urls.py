
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path('', include('chat.urls')),
    path('', include('users.urls')),
    path('admin/', admin.site.urls),
]
