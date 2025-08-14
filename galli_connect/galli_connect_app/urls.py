from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('', views.homepage, name='homepage'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login')
]


