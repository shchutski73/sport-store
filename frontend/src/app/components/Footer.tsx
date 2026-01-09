import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-600">SportStore</h3>
            <p className="text-gray-400 text-sm">
              Интернет-магазин спортивных товаров для активного образа жизни.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Каталог</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/catalog" className="hover:text-orange-600 transition-colors">
                  Все товары
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-600 transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-orange-600 transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-orange-600 transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-orange-600 transition-colors">
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-orange-600 transition-colors">
                  Возврат товара
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>+7 (999) 123-45-67</li>
              <li>info@sportstore.ru</li>
              <li>г. Москва, ул. Спортивная, д. 1</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} SportStore. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}