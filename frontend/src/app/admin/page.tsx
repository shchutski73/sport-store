'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: string;
  in_stock: boolean;
  category?: { name: string };
}

interface Order {
  id: number;
  status: string;
  total_price: string;
  created_at: string;
  user: number;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'contacts'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      
      if (activeTab === 'products') {
        const response = await fetch(`${API_URL}/admin/products/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } else if (activeTab === 'orders') {
        const response = await fetch(`${API_URL}/admin/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } else if (activeTab === 'contacts') {
        const response = await fetch(`${API_URL}/admin/contacts/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/admin/orders/${orderId}/status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Админ-панель</h1>
          <Link
            href="/"
            className="text-orange-600 hover:underline"
          >
            Вернуться на сайт
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'products'
                ? 'border-b-2 border-orange-600 text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Товары
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'orders'
                ? 'border-b-2 border-orange-600 text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Заказы
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'contacts'
                ? 'border-b-2 border-orange-600 text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Контакты
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Товары</h2>
                  <Link
                    href="/admin/products/new"
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                  >
                    Добавить товар
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">ID</th>
                        <th className="text-left py-3 px-4">Название</th>
                        <th className="text-left py-3 px-4">Цена</th>
                        <th className="text-left py-3 px-4">Категория</th>
                        <th className="text-left py-3 px-4">В наличии</th>
                        <th className="text-left py-3 px-4">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="py-3 px-4">{product.id}</td>
                          <td className="py-3 px-4">{product.name}</td>
                          <td className="py-3 px-4">{product.price} ₽</td>
                          <td className="py-3 px-4">
                            {product.category?.name || '-'}
                          </td>
                          <td className="py-3 px-4">
                            {product.in_stock ? (
                              <span className="text-green-600">Да</span>
                            ) : (
                              <span className="text-red-600">Нет</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="text-orange-600 hover:underline"
                            >
                              Редактировать
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Заказы</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">ID</th>
                        <th className="text-left py-3 px-4">Сумма</th>
                        <th className="text-left py-3 px-4">Статус</th>
                        <th className="text-left py-3 px-4">Дата</th>
                        <th className="text-left py-3 px-4">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-3 px-4">#{order.id}</td>
                          <td className="py-3 px-4">{order.total_price} ₽</td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order.id, e.target.value)
                              }
                              className="border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="pending">Ожидает обработки</option>
                              <option value="processing">В обработке</option>
                              <option value="shipped">Отправлен</option>
                              <option value="delivered">Доставлен</option>
                              <option value="cancelled">Отменен</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(order.created_at).toLocaleDateString('ru-RU')}
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="text-orange-600 hover:underline"
                            >
                              Подробнее
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Сообщения</h2>
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{contact.name}</p>
                          <p className="text-gray-600 text-sm">{contact.email}</p>
                        </div>
                        <p className="text-gray-500 text-sm">
                          {new Date(contact.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <p className="text-gray-700 mt-2">{contact.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

