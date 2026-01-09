export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          О нас
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">
              Добро пожаловать в SportStore!
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Мы — современный интернет-магазин спортивных товаров, который
              предлагает широкий ассортимент качественной продукции для активного
              образа жизни.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Наша миссия — помочь каждому найти идеальные спортивные товары,
              которые подходят именно ему. Мы тщательно отбираем каждый товар,
              чтобы предложить вам только лучшее.
            </p>
            <p className="text-gray-700 leading-relaxed">
              В SportStore вы найдете все необходимое для занятий спортом:
              от экипировки до аксессуаров. Мы работаем напрямую с проверенными
              поставщиками, что позволяет нам предлагать конкурентные цены и
              гарантировать качество товаров.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
              <p className="text-gray-700">Гарантия качества</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <p className="text-gray-700">Поддержка клиентов</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">1000+</div>
              <p className="text-gray-700">Довольных клиентов</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">
              Почему выбирают нас?
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">✓</span>
                <span className="text-gray-700">
                  Широкий ассортимент спортивных товаров от ведущих брендов
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">✓</span>
                <span className="text-gray-700">
                  Конкурентные цены и регулярные акции
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">✓</span>
                <span className="text-gray-700">
                  Быстрая доставка по всей стране
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">✓</span>
                <span className="text-gray-700">
                  Профессиональная консультация по выбору товаров
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">✓</span>
                <span className="text-gray-700">
                  Гарантия на все товары
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

