from rest_framework import serializers
from .models import Contact, Product, Cart, CartItem, Category, ProductSpecification, Order, OrderItem, PaymentCard

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['name', 'email', 'message']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class ProductSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpecification
        fields = ['name', 'value']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'price', 'image_url', 'category', 'category_id', 'in_stock', 'specifications', 'created_at']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True, source='items.all')

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'total_price']

class PaymentCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentCard
        fields = ['id', 'card_number', 'card_holder_name', 'expiry_month', 'expiry_year', 'is_default', 'created_at']
        read_only_fields = ['created_at']

class PaymentCardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentCard
        fields = ['card_number', 'card_holder_name', 'expiry_month', 'expiry_year', 'is_default']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    payment_card = PaymentCardSerializer(read_only=True)
    payment_card_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'total_price', 'total_items', 'payment_method', 'payment_card', 'payment_card_id', 'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'postal_code', 'notes', 'items', 'created_at', 'updated_at']
        read_only_fields = ['user', 'status', 'total_price', 'created_at', 'updated_at']