'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface PaymentCard {
  id: number;
  card_number: string;
  card_holder_name: string;
  expiry_month: string;
  expiry_year: string;
  is_default: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [addingCard, setAddingCard] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    notes: '',
    payment_method: 'cash',
    payment_card_id: '',
  });
  const [newCard, setNewCard] = useState({
    card_number: '',
    card_holder_name: '',
    expiry_month: '',
    expiry_year: '',
    is_default: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchPaymentCards();
    }
  }, [isAuthenticated, router]);

  const fetchPaymentCards = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/payment-cards/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const cards = await response.json();
        setPaymentCards(cards);
        // Устанавливаем карту по умолчанию, если есть
        const defaultCard = cards.find((card: PaymentCard) => card.is_default);
        if (defaultCard && formData.payment_method === 'card') {
          setFormData({ ...formData, payment_card_id: defaultCard.id.toString() });
        }
      }
    } catch (error) {
      console.error('Error fetching payment cards:', error);
    }
  };

  const handleAddCard = async (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => {
    e.preventDefault();
    
    // Валидация полей
    if (!newCard.card_number.trim() || !newCard.card_holder_name.trim() || 
        !newCard.expiry_month.trim() || !newCard.expiry_year.trim()) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setAddingCard(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/payment-cards/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCard),
      });
      if (response.ok) {
        const card = await response.json();
        await fetchPaymentCards();
        setFormData({ ...formData, payment_card_id: card.id.toString() });
        setNewCard({
          card_number: '',
          card_holder_name: '',
          expiry_month: '',
          expiry_year: '',
          is_default: false,
        });
        setShowAddCard(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Ошибка при добавлении карты');
      }
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Ошибка при добавлении карты');
    } finally {
      setAddingCard(false);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm('Удалить эту карту?')) return;
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/payment-cards/${cardId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await fetchPaymentCards();
        if (formData.payment_card_id === cardId.toString()) {
          setFormData({ ...formData, payment_card_id: '' });
        }
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Ошибка при удалении карты');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewCard({
      ...newCard,
      [e.target.name]: e.target.name === 'is_default' ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const orderData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        notes: formData.notes,
        payment_method: formData.payment_method,
      };
      
      if (formData.payment_method === 'card' && formData.payment_card_id) {
        orderData.payment_card_id = parseInt(formData.payment_card_id);
      }
      
      const response = await fetch(`${API_URL}/orders/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        router.push('/orders/success');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Произошла ошибка при оформлении заказа');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Произошла ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Оформление заказа
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Данные для доставки</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Имя *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Фамилия *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес доставки *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Город *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Индекс
                  </label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Комментарий к заказу
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6 border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Способ оплаты</h3>
                
                <div className="space-y-3 mb-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={formData.payment_method === 'cash'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Наличными при получении</div>
                      <div className="text-sm text-gray-500">Оплата курьеру при доставке</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={formData.payment_method === 'card'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Банковская карта</div>
                      <div className="text-sm text-gray-500">Оплата привязанной картой</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment_method"
                      value="online"
                      checked={formData.payment_method === 'online'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Онлайн оплата</div>
                      <div className="text-sm text-gray-500">Оплата через платежную систему</div>
                    </div>
                  </label>
                </div>

                {formData.payment_method === 'card' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Выберите карту
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAddCard(!showAddCard)}
                        className="text-sm text-orange-600 hover:text-orange-700"
                      >
                        {showAddCard ? 'Отмена' : '+ Добавить карту'}
                      </button>
                    </div>

                    {showAddCard && (
                      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-300">
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Номер карты *
                          </label>
                          <input
                            type="text"
                            name="card_number"
                            value={newCard.card_number}
                            onChange={handleCardChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Имя владельца *
                          </label>
                          <input
                            type="text"
                            name="card_holder_name"
                            value={newCard.card_holder_name}
                            onChange={handleCardChange}
                            placeholder="IVAN IVANOV"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Месяц *
                            </label>
                            <input
                              type="text"
                              name="expiry_month"
                              value={newCard.expiry_month}
                              onChange={handleCardChange}
                              placeholder="12"
                              maxLength={2}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Год *
                            </label>
                            <input
                              type="text"
                              name="expiry_year"
                              value={newCard.expiry_year}
                              onChange={handleCardChange}
                              placeholder="2025"
                              maxLength={4}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="is_default"
                              checked={newCard.is_default}
                              onChange={handleCardChange}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Сделать картой по умолчанию</span>
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddCard}
                          disabled={addingCard}
                          className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                        >
                          {addingCard ? 'Добавление...' : 'Добавить карту'}
                        </button>
                      </div>
                    )}

                    {paymentCards.length > 0 ? (
                      <div className="space-y-2">
                        {paymentCards.map((card) => (
                          <label
                            key={card.id}
                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                              formData.payment_card_id === card.id.toString()
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="payment_card_id"
                                value={card.id}
                                checked={formData.payment_card_id === card.id.toString()}
                                onChange={handleChange}
                                className="mr-3"
                              />
                              <div>
                                <div className="font-medium">{card.card_number}</div>
                                <div className="text-sm text-gray-500">
                                  {card.card_holder_name} • {card.expiry_month}/{card.expiry_year}
                                  {card.is_default && (
                                    <span className="ml-2 text-orange-600">(По умолчанию)</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteCard(card.id);
                              }}
                              className="text-red-600 hover:text-red-700 text-sm ml-4"
                            >
                              Удалить
                            </button>
                          </label>
                        ))}
                      </div>
                    ) : (
                      !showAddCard && (
                        <div className="text-center py-4 text-gray-500">
                          У вас нет привязанных карт. Добавьте карту для оплаты.
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || (formData.payment_method === 'card' && !formData.payment_card_id && paymentCards.length > 0)}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Оформление...' : 'Оформить заказ'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Информация</h2>
              <p className="text-gray-600 text-sm mb-4">
                После оформления заказа с вами свяжется менеджер для подтверждения
                и уточнения деталей доставки.
              </p>
              <p className="text-gray-600 text-sm">
                Оплата производится при получении товара или онлайн (в перспективе).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

