from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from . import views

urlpatterns = [
    # Authentication endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.register_view, name='register'),
    path('user/', views.user_view, name='user'),
    
    # Public endpoints
    path('contact/', views.contact_view, name='contact'),
    path('products/', views.products_view, name='products'),
    path('products/<str:slug>/', views.product_detail_view, name='product-detail'),
    path('categories/', views.categories_view, name='categories'),
    
    # Cart endpoints (authenticated)
    path('cart/', views.cart_view, name='cart'),
    path('cart/add/', views.add_to_cart_view, name='add-to-cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart_view, name='remove-from-cart'),
    path('cart/update/<int:item_id>/', views.update_cart_item_view, name='update-cart-item'),
    
    # Order endpoints (authenticated)
    path('orders/', views.orders_view, name='orders'),
    path('orders/create/', views.create_order_view, name='create-order'),
    path('orders/<int:order_id>/', views.order_detail_view, name='order-detail'),
    
    # Payment Card endpoints (authenticated)
    path('payment-cards/', views.payment_cards_view, name='payment-cards'),
    path('payment-cards/<int:card_id>/', views.payment_card_detail_view, name='payment-card-detail'),
    
    # Admin endpoints
    path('admin/products/', views.admin_products_view, name='admin-products'),
    path('admin/products/<int:product_id>/', views.admin_product_detail_view, name='admin-product-detail'),
    path('admin/categories/', views.admin_categories_view, name='admin-categories'),
    path('admin/orders/', views.admin_orders_view, name='admin-orders'),
    path('admin/orders/<int:order_id>/status/', views.admin_order_status_view, name='admin-order-status'),
    path('admin/contacts/', views.admin_contacts_view, name='admin-contacts'),
]