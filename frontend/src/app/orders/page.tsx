'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    image_url: string;
    price: string;
  };
  quantity: number;
  price: string;
  total_price: string;
}

interface Order {
  id: number;
  status: string;
  total_price: string;
  total_items: number;
  payment_method: string;
  payment_card: {
    card_number: string;
  } | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  notes: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

const statusLabels: { [key: string]: string } = {
  pending: 'Ожидает обработки',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменен',
};

const statusColors: { [key: string]: string } = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentMethodLabels: { [key: string]: string } = {
  cash: 'Наличными при получении',
  card: 'Банковская карта',
  online: 'Онлайн оплата',
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        fetchOrders();
      }
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/orders/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Error fetching orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">История заказов</h1>
          <Link
            href="/"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Вернуться в каталог
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              У вас пока нет заказов
            </h2>
            <p className="text-gray-600 mb-6">
              Начните делать покупки, чтобы увидеть здесь историю ваших заказов
            </p>
            <Link
              href="/catalog"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Заказ #{order.id}
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {parseFloat(order.total_price).toLocaleString('ru-RU', {
                          style: 'currency',
                          currency: 'RUB',
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.total_items} {order.total_items === 1 ? 'товар' : order.total_items < 5 ? 'товара' : 'товаров'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-2"
                    >
                      {expandedOrder === order.id ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          Скрыть детали
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          Показать детали
                        </>
                      )}
                    </button>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Товары в заказе
                        </h3>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                            >
                              <Link
                                href={`/product/${item.product.slug}`}
                                className="flex-shrink-0"
                              >
                                <img
                                  src={item.product.image_url || '/placeholder.png'}
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/product/${item.product.slug}`}
                                  className="font-medium text-gray-900 hover:text-orange-600"
                                >
                                  {item.product.name}
                                </Link>
                                <p className="text-sm text-gray-500">
                                  Количество: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {parseFloat(item.total_price).toLocaleString('ru-RU', {
                                    style: 'currency',
                                    currency: 'RUB',
                                  })}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {parseFloat(item.price).toLocaleString('ru-RU', {
                                    style: 'currency',
                                    currency: 'RUB',
                                  })} за шт.
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Способ оплаты
                          </h3>
                          <p className="text-gray-600">
                            {paymentMethodLabels[order.payment_method] || order.payment_method}
                          </p>
                          {order.payment_card && (
                            <p className="text-sm text-gray-500 mt-1">
                              Карта: {order.payment_card.card_number}
                            </p>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Адрес доставки
                          </h3>
                          <p className="text-gray-600">
                            {order.city}, {order.address}
                            {order.postal_code && `, ${order.postal_code}`}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {order.first_name} {order.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.phone}
                          </p>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="pt-4 border-t">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Комментарий к заказу
                          </h3>
                          <p className="text-gray-600">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

