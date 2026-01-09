import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Заказ успешно оформлен!
        </h1>
        <p className="text-gray-600 mb-6">
          Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время для подтверждения и уточнения деталей доставки.
        </p>
        <div className="space-y-3">
          <Link
            href="/orders"
            className="block w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Посмотреть мои заказы
          </Link>
          <Link
            href="/catalog"
            className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Продолжить покупки
          </Link>
          <Link
            href="/"
            className="block w-full text-gray-600 px-6 py-3 rounded-lg font-semibold hover:text-gray-800 transition-colors"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}

