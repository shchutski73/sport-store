'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: string;
    image_url?: string;
  };
  quantity: number;
  total_price: string;
}

interface Cart {
  id: number;
  items: CartItem[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCart(data);
        } else if (response.status === 404) {
          setCart({ id: 0, items: [] });
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  const removeFromCart = async (itemId: number) => {
    if (!isAuthenticated) {
      alert('Для удаления из корзины необходимо войти в систему');
      router.push('/login');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/cart/remove/${itemId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh cart
        const cartResponse = await fetch(`${API_URL}/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (cartResponse.ok) {
          const data = await cartResponse.json();
          setCart(data);
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Ошибка при удалении товара из корзины');
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (!isAuthenticated) {
      alert('Для изменения количества необходимо войти в систему');
      router.push('/login');
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/cart/update/${itemId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        // Refresh cart
        const cartResponse = await fetch(`${API_URL}/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (cartResponse.ok) {
          const data = await cartResponse.json();
          setCart(data);
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Ошибка при обновлении количества');
    }
  };

  const getTotalPrice = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce(
      (total, item) => total + parseFloat(item.total_price),
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка корзины...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">Для просмотра корзины необходимо войти в систему</p>
            <Link
              href="/login"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Корзина</h1>

        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">Ваша корзина пуста</p>
            <Link
              href="/catalog"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-4"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        Нет фото
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <Link
                      href={`/product/${item.product.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-orange-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-gray-600 mt-1">
                      {item.product.price} ₽ за шт.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {item.total_price} ₽
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm mt-1"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-4">Итого</h2>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Товаров:</span>
                    <span>
                      {cart.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4 border-t">
                    <span>Сумма:</span>
                    <span className="text-orange-600">
                      {getTotalPrice().toFixed(2)} ₽
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Оформить заказ
                </button>
                <Link
                  href="/catalog"
                  className="block text-center text-orange-600 hover:underline mt-4"
                >
                  Продолжить покупки
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

