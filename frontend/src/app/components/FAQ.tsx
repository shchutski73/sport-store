'use client';

import { useState } from 'react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Как оформить заказ?",
      answer: "Добавьте товары в корзину, перейдите к оформлению заказа и укажите данные для доставки и оплаты."
    },
    {
      question: "Какие способы доставки доступны?",
      answer: "Доставка осуществляется курьером по указанному адресу. Срок и стоимость уточняются при оформлении заказа."
    },
    {
      question: "Какие способы оплаты доступны?",
      answer: "Вы можете оплатить заказ наличными при получении или использовать банковскую карту."
    },
    {
      question: "Можно ли изменить или отменить заказ?",
      answer: "Свяжитесь с нами как можно скорее после оформления заказа, чтобы изменить данные или отменить его."
    },
    {
      question: "Как отследить мой заказ?",
      answer: "Статус заказа доступен в разделе «Мои заказы» в личном кабинете после входа в аккаунт."
    },
    {
      question: "Можно ли вернуть товар?",
      answer: "Возврат возможен в соответствии с действующим законодательством и правилами интернет-магазина."
    },
    {
      question: "Как связаться с поддержкой?",
      answer: "Используйте страницу «Контакты», чтобы отправить сообщение или позвонить нам по указанному телефону."
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