from django.core.management.base import BaseCommand
from api.models import Product, Category, ProductSpecification


class Command(BaseCommand):
    help = 'Добавляет товары в базу данных'

    def handle(self, *args, **options):
        # Создаем категории
        categories = {
            'sneakers': Category.objects.get_or_create(
                slug='sneakers',
                defaults={'name': 'Кроссовки', 'description': 'Спортивная обувь для бега и тренировок'}
            )[0],
            'clothing': Category.objects.get_or_create(
                slug='clothing',
                defaults={'name': 'Одежда', 'description': 'Спортивная одежда и экипировка'}
            )[0],
            'equipment': Category.objects.get_or_create(
                slug='equipment',
                defaults={'name': 'Снаряжение', 'description': 'Спортивное снаряжение и инвентарь'}
            )[0],
            'accessories': Category.objects.get_or_create(
                slug='accessories',
                defaults={'name': 'Аксессуары', 'description': 'Спортивные аксессуары'}
            )[0],
        }

        products_data = [
            {
                'name': 'Кроссовки Nike Air Max 270',
                'slug': 'nike-air-max-270',
                'description': 'Легкие и удобные кроссовки Nike Air Max 270 с технологией Air для максимального комфорта при беге и повседневной носке. Идеально подходят для тренировок и активного образа жизни.',
                'price': 129.99,
                'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
                'category': categories['sneakers'],
                'specifications': [
                    {'name': 'Бренд', 'value': 'Nike'},
                    {'name': 'Размеры', 'value': '38-45'},
                    {'name': 'Материал верха', 'value': 'Синтетическая кожа'},
                    {'name': 'Материал подошвы', 'value': 'Резина'},
                    {'name': 'Вес', 'value': '320 г'},
                ]
            },
            {
                'name': 'Кроссовки Adidas Ultraboost 22',
                'slug': 'adidas-ultraboost-22',
                'description': 'Премиальные беговые кроссовки Adidas Ultraboost 22 с технологией Boost для отличной амортизации и энергоотдачи. Подходят для длительных пробежек и интенсивных тренировок.',
                'price': 149.99,
                'image_url': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
                'category': categories['sneakers'],
                'specifications': [
                    {'name': 'Бренд', 'value': 'Adidas'},
                    {'name': 'Размеры', 'value': '38-46'},
                    {'name': 'Материал верха', 'value': 'Primeknit'},
                    {'name': 'Технология', 'value': 'Boost'},
                    {'name': 'Вес', 'value': '310 г'},
                ]
            },
            {
                'name': 'Спортивный костюм Nike Dri-FIT',
                'slug': 'nike-dri-fit-suit',
                'description': 'Спортивный костюм Nike Dri-FIT из влагоотводящей ткани. Обеспечивает комфорт и свободу движений во время тренировок. Идеален для бега, фитнеса и активного отдыха.',
                'price': 89.99,
                'image_url': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
                'category': categories['clothing'],
                'specifications': [
                    {'name': 'Бренд', 'value': 'Nike'},
                    {'name': 'Размеры', 'value': 'S, M, L, XL, XXL'},
                    {'name': 'Материал', 'value': 'Полиэстер'},
                    {'name': 'Технология', 'value': 'Dri-FIT'},
                    {'name': 'Состав', 'value': '100% полиэстер'},
                ]
            },
            {
                'name': 'Футболка Adidas Climalite',
                'slug': 'adidas-climalite-t-shirt',
                'description': 'Спортивная футболка Adidas Climalite с технологией быстрого отвода влаги. Легкая и дышащая ткань обеспечивает комфорт во время интенсивных тренировок.',
                'price': 34.99,
                'image_url': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
                'category': categories['clothing'],
                'specifications': [
                    {'name': 'Бренд', 'value': 'Adidas'},
                    {'name': 'Размеры', 'value': 'S, M, L, XL'},
                    {'name': 'Материал', 'value': 'Полиэстер'},
                    {'name': 'Технология', 'value': 'Climalite'},
                ]
            },
            {
                'name': 'Шорты Puma Training',
                'slug': 'puma-training-shorts',
                'description': 'Спортивные шорты Puma для тренировок. Легкие, эластичные, с карманами для мелочей. Идеальны для фитнеса, бега и активного отдыха.',
                'price': 39.99,
                'image_url': 'https://images.unsplash.com/photo-1506629905607-1b0b0c0b0b0b?w=500',
                'category': categories['clothing'],
                'specifications': [
                    {'name': 'Бренд', 'value': 'Puma'},
                    {'name': 'Размеры', 'value': 'S, M, L, XL'},
                    {'name': 'Материал', 'value': 'Полиэстер'},
                    {'name': 'Длина', 'value': 'Средняя'},
                ]
            },
            {
                'name': 'Гантели разборные 2x20 кг',
                'slug': 'dumbbells-2x20kg',
                'description': 'Разборные гантели с набором блинов общим весом 2x20 кг. Хромированные грифы, прорезиненные блины. Идеально для домашних тренировок и тренажерного зала.',
                'price': 79.99,
                'image_url': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
                'category': categories['equipment'],
                'specifications': [
                    {'name': 'Вес', 'value': '2x20 кг'},
                    {'name': 'Материал', 'value': 'Чугун, хром'},
                    {'name': 'Покрытие', 'value': 'Резина'},
                    {'name': 'Тип', 'value': 'Разборные'},
                ]
            },
            {
                'name': 'Йога-мат Premium 10мм',
                'slug': 'yoga-mat-premium-10mm',
                'description': 'Профессиональный йога-мат толщиной 10 мм с антискользящим покрытием. Идеален для йоги, пилатеса и фитнеса. Легко сворачивается и переносится.',
                'price': 29.99,
                'image_url': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500',
                'category': categories['equipment'],
                'specifications': [
                    {'name': 'Толщина', 'value': '10 мм'},
                    {'name': 'Размер', 'value': '180x60 см'},
                    {'name': 'Материал', 'value': 'TPE'},
                    {'name': 'Покрытие', 'value': 'Антискользящее'},
                ]
            },
            {
                'name': 'Скакалка скоростная',
                'slug': 'speed-jump-rope',
                'description': 'Профессиональная скоростная скакалка с подшипниками для плавного вращения. Регулируемая длина. Идеальна для кардио-тренировок и кроссфита.',
                'price': 14.99,
                'image_url': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
                'category': categories['equipment'],
                'specifications': [
                    {'name': 'Длина', 'value': 'Регулируемая'},
                    {'name': 'Материал троса', 'value': 'Сталь'},
                    {'name': 'Рукоятки', 'value': 'Пластик'},
                    {'name': 'Подшипники', 'value': 'Да'},
                ]
            },
            {
                'name': 'Спортивная сумка Nike Brasilia',
                'slug': 'nike-brasilia-bag',
                'description': 'Вместительная спортивная сумка Nike Brasilia с отделениями для обуви и влажных вещей. Удобные ручки и регулируемый ремень для переноски.',
                'price': 44.99,
                'image_url': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
                'category': categories['accessories'],
                'specifications': [
                    {'name': 'Бренд', 'value': 'Nike'},
                    {'name': 'Объем', 'value': '30 л'},
                    {'name': 'Материал', 'value': 'Полиэстер'},
                    {'name': 'Отделения', 'value': '2 основных + карманы'},
                ]
            },
            {
                'name': 'Бутылка для воды 750 мл',
                'slug': 'water-bottle-750ml',
                'description': 'Спортивная бутылка для воды объемом 750 мл из безопасного пластика. Удобная крышка с клапаном, легко моется. Идеальна для тренировок и активного образа жизни.',
                'price': 9.99,
                'image_url': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
                'category': categories['accessories'],
                'specifications': [
                    {'name': 'Объем', 'value': '750 мл'},
                    {'name': 'Материал', 'value': 'Тритан'},
                    {'name': 'Крышка', 'value': 'Спортивная'},
                    {'name': 'Безопасность', 'value': 'BPA-free'},
                ]
            },
            {
                'name': 'Фитнес-браслет Xiaomi Mi Band 7',
                'slug': 'xiaomi-mi-band-7',
                'description': 'Умный фитнес-браслет с мониторингом пульса, шагов, калорий и сна. Водонепроницаемый, с цветным дисплеем. Работает до 14 дней без подзарядки.',
                'price': 49.99,
                'image_url': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
                'category': categories['accessories'],
                'specifications': [
                    {'name': 'Бренд', 'value': 'Xiaomi'},
                    {'name': 'Дисплей', 'value': '1.62" AMOLED'},
                    {'name': 'Водозащита', 'value': '5 ATM'},
                    {'name': 'Батарея', 'value': 'До 14 дней'},
                ]
            },
            {
                'name': 'Кроссовки New Balance 574',
                'slug': 'new-balance-574',
                'description': 'Классические кроссовки New Balance 574 с энкаустической подошвой. Удобные и стильные, подходят для повседневной носки и легких тренировок.',
                'price': 99.99,
                'image_url': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
                'category': categories['sneakers'],
                'specifications': [
                    {'name': 'Бренд', 'value': 'New Balance'},
                    {'name': 'Размеры', 'value': '38-45'},
                    {'name': 'Материал', 'value': 'Кожа, текстиль'},
                    {'name': 'Подошва', 'value': 'Энкаустическая'},
                ]
            },
            {
                'name': 'Толстовка с капюшоном Nike Sportswear',
                'slug': 'nike-sportswear-hoodie',
                'description': 'Теплая толстовка с капюшоном Nike Sportswear из мягкого флиса. Удобный крой, карман-кенгуру. Идеальна для тренировок на улице и повседневной носки.',
                'price': 69.99,
                'image_url': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
                'category': categories['clothing'],
                'specifications': [
                    {'name': 'Бренд', 'value': 'Nike'},
                    {'name': 'Размеры', 'value': 'S, M, L, XL, XXL'},
                    {'name': 'Материал', 'value': 'Флис'},
                    {'name': 'Капюшон', 'value': 'Да'},
                ]
            },
            {
                'name': 'Мяч футбольный Adidas Tiro',
                'slug': 'adidas-tiro-football',
                'description': 'Профессиональный футбольный мяч Adidas Tiro для тренировок и игр. Качественная кожа, отличный отскок и контроль. Соответствует стандартам FIFA.',
                'price': 24.99,
                'image_url': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500',
                'category': categories['equipment'],
                'specifications': [
                    {'name': 'Бренд', 'value': 'Adidas'},
                    {'name': 'Размер', 'value': '5 (стандарт)'},
                    {'name': 'Материал', 'value': 'Синтетическая кожа'},
                    {'name': 'Вес', 'value': '410-450 г'},
                ]
            },
            {
                'name': 'Спортивные носки Nike Dri-FIT',
                'slug': 'nike-dri-fit-socks',
                'description': 'Комплект спортивных носков Nike Dri-FIT (3 пары) с технологией отвода влаги. Анатомическая форма, усиленные зоны. Идеальны для бега и тренировок.',
                'price': 19.99,
                'image_url': 'https://images.unsplash.com/photo-1586350977772-b3b4e4e7d3c7?w=500',
                'category': categories['accessories'],
                'specifications': [
                    {'name': 'Бренд', 'value': 'Nike'},
                    {'name': 'Количество', 'value': '3 пары'},
                    {'name': 'Материал', 'value': 'Полиэстер, эластан'},
                    {'name': 'Технология', 'value': 'Dri-FIT'},
                ]
            },
        ]

        created_count = 0
        updated_count = 0

        for product_data in products_data:
            specifications = product_data.pop('specifications', [])
            
            product, created = Product.objects.update_or_create(
                slug=product_data['slug'],
                defaults={
                    'name': product_data['name'],
                    'description': product_data['description'],
                    'price': product_data['price'],
                    'image_url': product_data.get('image_url', ''),
                    'category': product_data.get('category'),
                    'in_stock': True,
                }
            )

            # Удаляем старые характеристики и добавляем новые
            ProductSpecification.objects.filter(product=product).delete()
            for spec in specifications:
                ProductSpecification.objects.create(
                    product=product,
                    name=spec['name'],
                    value=spec['value']
                )

            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Создан товар: {product.name}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Обновлен товар: {product.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nГотово! Создано: {created_count}, Обновлено: {updated_count}'
            )
        )

