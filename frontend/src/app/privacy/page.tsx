export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Политика конфиденциальности
          </h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                1. Общие положения
              </h2>
              <p className="leading-relaxed">
                Настоящая Политика конфиденциальности определяет порядок обработки
                и защиты персональных данных пользователей интернет-магазина
                SportStore. Используя наш сайт, вы соглашаетесь с условиями
                настоящей политики.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                2. Собираемая информация
              </h2>
              <p className="leading-relaxed mb-2">
                Мы собираем следующую информацию:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Имя и контактные данные (email, телефон)</li>
                <li>Адрес доставки</li>
                <li>Информация о заказах</li>
                <li>Технические данные (IP-адрес, тип браузера)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                3. Использование информации
              </h2>
              <p className="leading-relaxed">
                Собранная информация используется для обработки заказов,
                связи с клиентами, улучшения качества обслуживания и
                предоставления персонализированных предложений.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                4. Защита данных
              </h2>
              <p className="leading-relaxed">
                Мы применяем современные методы защиты информации и не
                передаем ваши персональные данные третьим лицам без вашего
                согласия, за исключением случаев, предусмотренных
                законодательством.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                5. Права пользователей
              </h2>
              <p className="leading-relaxed">
                Вы имеете право запросить доступ к вашим персональным данным,
                их исправление или удаление. Для этого свяжитесь с нами через
                форму обратной связи или по email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                6. Контакты
              </h2>
              <p className="leading-relaxed">
                По вопросам, связанным с обработкой персональных данных,
                обращайтесь: info@sportstore.ru
              </p>
            </section>

            <section className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

