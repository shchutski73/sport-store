'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface OrderSummary {
  id: number;
  status: string;
  total_price: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setOrders(await response.json());
        }
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/user/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Не удалось сохранить изменения');
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setMessage('Данные профиля успешно сохранены');
      await refreshUser();
    } catch {
      setError('Произошла ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  const activeOrders = orders.filter((order) => !['delivered', 'cancelled'].includes(order.status)).length;
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Личный кабинет</h1>
          <p className="mt-2 text-gray-600">Управление данными и просмотр покупок</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-3xl font-bold">
                {(user?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">{user?.username}</h2>
              <p className="text-gray-500 break-all">{user?.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <p className="text-sm text-gray-500">Заказов</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {loadingOrders ? '...' : orders.length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <p className="text-sm text-gray-500">Активных</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {loadingOrders ? '...' : activeOrders}
                </p>
              </div>
            </div>

            <Link href="/orders" className="block text-center bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Все мои заказы
            </Link>
          </aside>

          <main className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Данные профиля</h2>

              {message && <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3">{message}</div>}
              {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">{error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Имя пользователя</label>
                  <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} required className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-orange-500 focus:ring-orange-500" />
                </div>
              </div>

              <div className="border-t mt-6 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Смена пароля</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">Текущий пароль</label>
                    <input id="current-password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-orange-500 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">Новый пароль</label>
                    <input id="new-password" type="password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-orange-500 focus:ring-orange-500" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={saving} className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 transition-colors">
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </form>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Последние заказы</h2>
                <Link href="/orders" className="text-orange-600 hover:text-orange-700 font-medium">Смотреть все</Link>
              </div>
              {loadingOrders ? (
                <p className="py-8 text-gray-500">Загрузка заказов...</p>
              ) : orders.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500 mb-4">У вас пока нет заказов</p>
                  <Link href="/catalog" className="text-orange-600 hover:text-orange-700 font-semibold">Перейти в каталог</Link>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <Link key={order.id} href="/orders" className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:border-orange-200 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-900">Заказ #{order.id}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('ru-RU')}</p>
                      </div>
                      <p className="font-bold text-gray-900">{Number(order.total_price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</p>
                    </Link>
                  ))}
                </div>
              )}
              {!loadingOrders && orders.length > 0 && (
                <p className="mt-5 text-sm text-gray-500">Общая сумма заказов: <span className="font-semibold text-gray-900">{totalSpent.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</span></p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
