from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('', views.homepage, name='homepage'),
    path('api/signup', views.signup, name='signup'),
    path('api/login', views.login, name='login'),
    path('api/add-driver-route/', views.add_driver_route, name='add_driver_route'),
    path('api/get-driver-routes/<int:driver_id>/', views.get_driver_routes, name='get_driver_routes'),
    path('api/update-driver-route/<int:driver_id>/<int:route_id>/', views.update_driver_route, name='update_driver_route'),
    path('api/delete-driver-route/<int:driver_id>/<int:route_id>/', views.delete_driver_route, name='delete_driver_route'),
    path('api/routes/search', views.search_routes, name='search_routes'),

]


