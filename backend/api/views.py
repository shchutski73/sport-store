from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
import logging
from .models import Contact, Product, Cart, CartItem, Order, OrderItem, Category, ProductSpecification, PaymentCard, Review
from .serializers import (
    ContactSerializer, ProductSerializer, CartSerializer, CartItemSerializer,
    OrderSerializer, OrderItemSerializer, CategorySerializer, ProductSpecificationSerializer,
    PaymentCardSerializer, PaymentCardCreateSerializer, ReviewSerializer
)

logger = logging.getLogger(__name__)

# Authentication endpoints
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    try:
        # Log incoming request data for debugging
        logger.info(f"Registration request received. Data keys: {list(request.data.keys()) if hasattr(request.data, 'keys') else 'N/A'}")
        
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Check for missing fields
        if not username or not email or not password:
            error_msg = "Требуются имя пользователя, email и пароль"
            logger.warning(f"Registration failed: {error_msg}. Received: username={bool(username)}, email={bool(email)}, password={bool(password)}")
            return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check for existing username
        if User.objects.filter(username=username).exists():
            error_msg = "Имя пользователя уже существует"
            logger.warning(f"Registration failed: {error_msg} - {username}")
            return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check for existing email
        if User.objects.filter(email=email).exists():
            error_msg = "Email уже существует"
            logger.warning(f"Registration failed: {error_msg} - {email}")
            return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)
        refresh = RefreshToken.for_user(user)
        
        logger.info(f"User created successfully: {username}")
        return Response({
            "message": "Пользователь успешно создан",
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        error_msg = f"An error occurred during registration: {str(e)}"
        logger.error(f"Registration error: {error_msg}", exc_info=True)
        return Response({"error": "Произошла ошибка при регистрации. Пожалуйста, попробуйте снова."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "is_staff": request.user.is_staff
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_view(request):
    if request.method == 'POST':
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Сообщение отправлено успешно"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def products_view(request):
    category_slug = request.query_params.get('category', None)
    products = Product.objects.filter(in_stock=True).prefetch_related('reviews', 'reviews__user')
    
    if category_slug:
        products = products.filter(category__slug=category_slug)
    
    products = products.order_by('-created_at')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail_view(request, slug):
    # Try to get by slug first, then by ID
    try:
        product = Product.objects.get(slug=slug, in_stock=True)
    except Product.DoesNotExist:
        try:
            product = Product.objects.get(id=int(slug), in_stock=True)
        except (Product.DoesNotExist, ValueError):
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def categories_view(request):
    categories = Category.objects.all().order_by('name')
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart_view(request):
    user = request.user
    cart, created = Cart.objects.get_or_create(user=user)
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)

    try:
        product = Product.objects.get(id=product_id)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={'quantity': quantity})
        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_view(request):
    user = request.user
    try:
        cart = Cart.objects.get(user=user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except Cart.DoesNotExist:
        return Response({"items": []})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart_view(request, item_id):
    user = request.user
    try:
        cart = Cart.objects.get(user=user)
        cart_item = CartItem.objects.get(id=item_id, cart=cart)
        cart_item.delete()
        return Response({"message": "Item removed from cart"})
    except (Cart.DoesNotExist, CartItem.DoesNotExist):
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_item_view(request, item_id):
    user = request.user
    try:
        cart = Cart.objects.get(user=user)
        cart_item = CartItem.objects.get(id=item_id, cart=cart)
        quantity = request.data.get('quantity', 1)
        if int(quantity) <= 0:
            cart_item.delete()
            return Response({"message": "Item removed from cart"})
        cart_item.quantity = int(quantity)
        cart_item.save()
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data)
    except (Cart.DoesNotExist, CartItem.DoesNotExist):
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order_view(request):
    user = request.user
    cart = Cart.objects.filter(user=user).first()
    
    if not cart or not cart.items.exists():
        return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Получаем данные заказа
    order_data = request.data.copy()
    payment_method = order_data.get('payment_method', 'cash')
    payment_card_id = order_data.get('payment_card_id')
    
    # Валидация способа оплаты
    valid_payment_methods = [choice[0] for choice in Order.PAYMENT_METHOD_CHOICES]
    if payment_method not in valid_payment_methods:
        return Response({"error": f"Недопустимый способ оплаты. Доступны: {', '.join(valid_payment_methods)}"}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    # Если выбран способ оплаты картой, проверяем наличие карты
    payment_card = None
    if payment_method == 'card':
        if not payment_card_id:
            return Response({"error": "Необходимо выбрать карту для оплаты"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            payment_card = PaymentCard.objects.get(id=payment_card_id, user=user)
        except PaymentCard.DoesNotExist:
            return Response({"error": "Карта не найдена"}, status=status.HTTP_404_NOT_FOUND)
    
    # Создаем заказ
    order = Order.objects.create(
        user=user,
        payment_method=payment_method,
        payment_card=payment_card,
        first_name=order_data.get('first_name'),
        last_name=order_data.get('last_name'),
        email=order_data.get('email'),
        phone=order_data.get('phone'),
        address=order_data.get('address'),
        city=order_data.get('city'),
        postal_code=order_data.get('postal_code', ''),
        notes=order_data.get('notes', ''),
    )
    
    # Переносим товары из корзины в заказ
    total_price = 0
    for cart_item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            quantity=cart_item.quantity,
            price=cart_item.product.price
        )
        total_price += cart_item.quantity * cart_item.product.price
    
    order.total_price = total_price
    order.save()
    
    # Очищаем корзину
    cart.items.all().delete()
    
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def orders_view(request):
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail_view(request, order_id):
    user = request.user
    order = get_object_or_404(Order, id=order_id, user=user)
    serializer = OrderSerializer(order)
    return Response(serializer.data)

# Admin endpoints
@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def admin_products_view(request):
    if request.method == 'GET':
        products = Product.objects.all().order_by('-created_at')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            # Handle specifications
            specifications = request.data.get('specifications', [])
            for spec in specifications:
                if spec.get('name') and spec.get('value'):
                    ProductSpecification.objects.update_or_create(
                        product=product,
                        name=spec['name'],
                        defaults={'value': spec['value']}
                    )
            return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def admin_product_detail_view(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            product = serializer.save()
            # Handle specifications
            if 'specifications' in request.data:
                # Delete existing specifications
                ProductSpecification.objects.filter(product=product).delete()
                # Add new specifications
                specifications = request.data.get('specifications', [])
                for spec in specifications:
                    if spec.get('name') and spec.get('value'):
                        ProductSpecification.objects.create(
                            product=product,
                            name=spec['name'],
                            value=spec['value']
                        )
            return Response(ProductSerializer(product).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        product.delete()
        return Response({"message": "Product deleted"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def admin_categories_view(request):
    if request.method == 'GET':
        categories = Category.objects.all().order_by('name')
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_orders_view(request):
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def admin_order_status_view(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    new_status = request.data.get('status')
    if new_status in dict(Order.STATUS_CHOICES):
        order.status = new_status
        order.save()
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_contacts_view(request):
    contacts = Contact.objects.all().order_by('-created_at')
    data = [{
        'id': c.id,
        'name': c.name,
        'email': c.email,
        'message': c.message,
        'created_at': c.created_at.strftime('%Y-%m-%d %H:%M:%S')
    } for c in contacts]
    return Response(data)

# Payment Card endpoints
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def payment_cards_view(request):
    user = request.user
    
    if request.method == 'GET':
        cards = PaymentCard.objects.filter(user=user)
        serializer = PaymentCardSerializer(cards, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Маскируем номер карты (оставляем только последние 4 цифры)
        card_number = request.data.get('card_number', '').strip()
        if card_number:
            # Удаляем все пробелы и дефисы
            card_number_cleaned = card_number.replace(' ', '').replace('-', '')
            if len(card_number_cleaned) >= 4:
                # Сохраняем только последние 4 цифры с маскировкой
                last_four = card_number_cleaned[-4:]
                masked_number = f"**** **** **** {last_four}"
                # Создаем копию данных для изменения
                data = request.data.copy()
                data['card_number'] = masked_number
                serializer = PaymentCardCreateSerializer(data=data)
            else:
                return Response({"error": "Неверный формат номера карты"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = PaymentCardCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Если устанавливается как карта по умолчанию, снимаем флаг с других карт
            if serializer.validated_data.get('is_default', False):
                PaymentCard.objects.filter(user=user, is_default=True).update(is_default=False)
            
            card = serializer.save(user=user)
            return Response(PaymentCardSerializer(card).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def payment_card_detail_view(request, card_id):
    user = request.user
    try:
        card = PaymentCard.objects.get(id=card_id, user=user)
    except PaymentCard.DoesNotExist:
        return Response({"error": "Карта не найдена"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        card.delete()
        return Response({"message": "Карта удалена"}, status=status.HTTP_204_NO_CONTENT)
    
    elif request.method == 'PUT':
        # Обновление карты (например, установка как карты по умолчанию)
        is_default = request.data.get('is_default', False)
        if is_default:
            # Снимаем флаг с других карт
            PaymentCard.objects.filter(user=user, is_default=True).update(is_default=False)
            card.is_default = True
            card.save()
            return Response(PaymentCardSerializer(card).data)
        return Response({"error": "Можно изменить только статус карты по умолчанию"}, 
                       status=status.HTTP_400_BAD_REQUEST)

# Review endpoints
@api_view(['GET'])
@permission_classes([AllowAny])
def product_reviews_view(request, product_id):
    """Получить все отзывы для товара"""
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    
    reviews = Review.objects.filter(product=product).order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review_view(request, product_id):
    """Создать отзыв на товар (только если пользователь купил товар)"""
    user = request.user
    
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Проверяем, купил ли пользователь этот товар
    # Разрешаем отзывы для заказов, которые не отменены (pending, processing, shipped, delivered)
    has_purchased = OrderItem.objects.filter(
        order__user=user,
        order__status__in=['pending', 'processing', 'shipped', 'delivered'],
        product=product
    ).exists()
    
    if not has_purchased:
        return Response(
            {"error": "Вы можете оставить отзыв только на товары, которые вы заказали. Убедитесь, что товар находится в ваших заказах."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Проверяем, не оставил ли пользователь уже отзыв
    existing_review = Review.objects.filter(user=user, product=product).first()
    if existing_review:
        return Response(
            {"error": "Вы уже оставили отзыв на этот товар"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Создаем отзыв
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        review = serializer.save(user=user, product=product)
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def review_detail_view(request, review_id):
    """Обновить или удалить свой отзыв"""
    user = request.user
    review = get_object_or_404(Review, id=review_id)
    
    # Проверяем, что пользователь является автором отзыва
    if review.user != user:
        return Response(
            {"error": "Вы можете изменять только свои отзывы"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'DELETE':
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    # PUT или PATCH
    partial = request.method == 'PATCH'
    serializer = ReviewSerializer(review, data=request.data, partial=partial)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
