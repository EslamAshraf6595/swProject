from django.urls import path
from . import views

urlpatterns = [
    # User Authentication
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),

    # Core Views
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('products/', views.products, name='products'),
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),
    path('product/<int:id>/', views.product_detail, name='product_detail'),
    # Cart Management
    path('cart/', views.cart_view, name='cart'),
    path('add_to_cart/', views.add_to_cart, name='add_to_cart'),
    path('remove_from_cart/', views.remove_from_cart, name='remove_from_cart'),
]
