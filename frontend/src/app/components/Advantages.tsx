export function Advantages() {
  const advantages = [
    {
      title: "Быстрота",
      description: "Высокая скорость работы и обработки данных"
    },
    {
      title: "Надежность",
      description: "Гарантированная стабильность и безопасность"
    },
    {
      title: "Поддержка",
      description: "Круглосуточная техническая поддержка"
    },
    {
      title: "Инновации",
      description: "Использование современных технологий"
    },
    {
      title: "Гибкость",
      description: "Адаптация под индивидуальные потребности"
    },
    {
      title: "Качество",
      description: "Высокие стандарты качества услуг"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Преимущества
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((adv, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{adv.title}</h3>
              <p className="text-gray-600">{adv.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}