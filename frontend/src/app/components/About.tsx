export function About() {
  const points = [
    "Продажа паркета из натурального массива дуба - классический, селект, рустик",
    "Профессиональная укладка паркета - плавающая, клеевая, на лаги",
    "Шлифовка и лакировка паркета - машинная и ручная обработка",
    "Гарантия качества на все виды работ и материалы",
    "Индивидуальный подход к каждому клиенту и проекту",
    "Консультации по выбору и уходу за паркетом"
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          О проекте
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {points.map((point, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
              <p className="text-gray-700 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}