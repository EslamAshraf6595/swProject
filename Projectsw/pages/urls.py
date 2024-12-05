from django.urls import path
from . import views

urlpatterns = [
    # path('',views.index,name='index'),
    path('login/',views.login,name='login'),
    path('',views.signup,name='signup'),
    path('home/',views.home,name='home'),
    path('about/',views.about,name='about'),
    path('products/',views.products,name='products'),
    
]