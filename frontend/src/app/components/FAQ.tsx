'use client';

import { useState } from 'react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Какие виды паркета вы предлагаете?",
      answer: "Мы предлагаем паркет из натурального массива дуба трех сортов: классический, селект и рустик."
    },
    {
      question: "Какие варианты укладки паркета существуют?",
      answer: "Мы выполняем плавающую укладку, укладку на клей и укладку на лаги в зависимости от типа помещения."
    },
    {
      question: "Как проводится шлифовка паркета?",
      answer: "Шлифовка выполняется профессиональным оборудованием с последующей лакировкой или масляной обработкой."
    },
    {
      question: "Предоставляете ли гарантию на работы?",
      answer: "Да, мы предоставляем гарантию 2 года на укладку и 5 лет на материалы."
    },
    {
      question: "Можно ли заказать паркет с доставкой?",
      answer: "Да, мы осуществляем доставку паркета по всей Москве и области."
    },
    {
      question: "Как ухаживать за паркетом после укладки?",
      answer: "Мы предоставляем консультации по уходу и рекомендуем специальные средства для чистки и защиты паркета."
    },
    {
      question: "Возможна ли укладка паркета на старое покрытие?",
      answer: "Да, но требуется предварительная оценка состояния основания."
    },
    {
      question: "Как рассчитывается стоимость работ?",
      answer: "Стоимость рассчитывается индивидуально в зависимости от площади, типа паркета и сложности работ."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Часто задаваемые вопросы
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 focus:outline-none"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}