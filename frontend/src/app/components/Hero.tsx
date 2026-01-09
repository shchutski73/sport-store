import React from 'react';
import { Button } from './Button';

export function Hero() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Паркет-Момент
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Профессиональная продажа, укладка и шлифовка паркета из натурального массива дуба
        </p>
        <Button href="#contact" className="text-lg px-8 py-4">
          Получить консультацию
        </Button>
      </div>
    </section>
  );
}