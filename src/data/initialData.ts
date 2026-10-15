import { Region, GameProduct, GiftCardDenomination, SubscriptionPlan, DigitalCode, Order } from '../types';

export const REGIONS: Region[] = [
  {
    id: 'turkey',
    name: 'Турция',
    countryName: 'Turkey',
    flag: '🇹🇷',
    currencyCode: 'TRY',
    currencySymbol: '₺',
    popular: true,
    description: 'Самый популярный регион среди геймеров Беларуси. Самые выгодные цены на новинки и подписки.',
    rateNote: '100 ₺ ≈ 9.40 BYN'
  },
  {
    id: 'poland',
    name: 'Польша',
    countryName: 'Poland',
    flag: '🇵🇱',
    currencyCode: 'PLN',
    currencySymbol: 'zł',
    popular: false,
    description: '100% гарантия полной русской озвучки почти во всех играх Sony. Европейский регион PS Store.',
    rateNote: '100 zł ≈ 82.00 BYN'
  },
  {
    id: 'india',
    name: 'Индия',
    countryName: 'India',
    flag: '🇮🇳',
    currencyCode: 'INR',
    currencySymbol: '₹',
    popular: false,
    description: 'Отличная альтернатива для покупки эксклюзивов. Практически полное совпадение с русским дубляжом.',
    rateNote: '1,000 ₹ ≈ 40.00 BYN'
  },
  {
    id: 'ukraine',
    name: 'Украина',
    countryName: 'Ukraine',
    flag: '🇺🇦',
    currencyCode: 'UAH',
    currencySymbol: '₴',
    popular: false,
    description: 'Удобная европейская библиотека игр. Большинство проектов имеют официальный перевод на русский.',
    rateNote: '500 ₴ ≈ 41.50 BYN'
  }
];

export const INITIAL_GIFT_CARDS: GiftCardDenomination[] = [
  // Turkey (TRY)
  { id: 'gc-tr-250', regionId: 'turkey', localAmount: 250, priceByn: 25.50, inStock: true, codesAvailableCount: 8 },
  { id: 'gc-tr-500', regionId: 'turkey', localAmount: 500, priceByn: 48.00, inStock: true, codesAvailableCount: 14 },
  { id: 'gc-tr-1000', regionId: 'turkey', localAmount: 1000, priceByn: 94.00, inStock: true, codesAvailableCount: 19 },
  { id: 'gc-tr-1500', regionId: 'turkey', localAmount: 1500, priceByn: 139.00, inStock: true, codesAvailableCount: 6 },
  { id: 'gc-tr-2000', regionId: 'turkey', localAmount: 2000, priceByn: 184.00, inStock: true, codesAvailableCount: 11 },
  { id: 'gc-tr-3000', regionId: 'turkey', localAmount: 3000, priceByn: 275.00, inStock: true, codesAvailableCount: 5 },
  { id: 'gc-tr-5000', regionId: 'turkey', localAmount: 5000, priceByn: 450.00, inStock: true, codesAvailableCount: 3 },

  // Poland (PLN)
  { id: 'gc-pl-50', regionId: 'poland', localAmount: 50, priceByn: 44.00, inStock: true, codesAvailableCount: 7 },
  { id: 'gc-pl-100', regionId: 'poland', localAmount: 100, priceByn: 86.00, inStock: true, codesAvailableCount: 12 },
  { id: 'gc-pl-150', regionId: 'poland', localAmount: 150, priceByn: 128.00, inStock: true, codesAvailableCount: 5 },
  { id: 'gc-pl-200', regionId: 'poland', localAmount: 200, priceByn: 169.00, inStock: true, codesAvailableCount: 9 },
  { id: 'gc-pl-300', regionId: 'poland', localAmount: 300, priceByn: 252.00, inStock: true, codesAvailableCount: 4 },
  { id: 'gc-pl-500', regionId: 'poland', localAmount: 500, priceByn: 415.00, inStock: true, codesAvailableCount: 2 },

  // India (INR)
  { id: 'gc-in-1000', regionId: 'india', localAmount: 1000, priceByn: 42.00, inStock: true, codesAvailableCount: 6 },
  { id: 'gc-in-2000', regionId: 'india', localAmount: 2000, priceByn: 83.00, inStock: true, codesAvailableCount: 8 },
  { id: 'gc-in-3000', regionId: 'india', localAmount: 3000, priceByn: 123.00, inStock: true, codesAvailableCount: 4 },
  { id: 'gc-in-5000', regionId: 'india', localAmount: 5000, priceByn: 202.00, inStock: true, codesAvailableCount: 3 },

  // Ukraine (UAH)
  { id: 'gc-ua-500', regionId: 'ukraine', localAmount: 500, priceByn: 43.00, inStock: true, codesAvailableCount: 9 },
  { id: 'gc-ua-1000', regionId: 'ukraine', localAmount: 1000, priceByn: 84.00, inStock: true, codesAvailableCount: 11 },
  { id: 'gc-ua-1500', regionId: 'ukraine', localAmount: 1500, priceByn: 125.00, inStock: true, codesAvailableCount: 4 },
  { id: 'gc-ua-2000', regionId: 'ukraine', localAmount: 2000, priceByn: 165.00, inStock: true, codesAvailableCount: 6 }
];

export const INITIAL_SUBSCRIPTIONS: SubscriptionPlan[] = [
  // Turkey
  {
    id: 'sub-tr-ess-1m',
    tier: 'essential',
    tierName: 'PlayStation Plus Essential',
    duration: '1m',
    durationLabel: '1 месяц',
    regionId: 'turkey',
    localAmount: 175,
    priceByn: 19.50,
    features: ['Сетевая игра онлайн', '3 бесплатные игры каждый месяц', 'Эксклюзивные скидки в PS Store', 'Облачное хранилище']
  },
  {
    id: 'sub-tr-ess-3m',
    tier: 'essential',
    tierName: 'PlayStation Plus Essential',
    duration: '3m',
    durationLabel: '3 месяца',
    regionId: 'turkey',
    localAmount: 440,
    priceByn: 46.00,
    features: ['Сетевая игра онлайн', '3 бесплатные игры каждый месяц', 'Эксклюзивные скидки в PS Store', 'Облачное хранилище']
  },
  {
    id: 'sub-tr-ess-12m',
    tier: 'essential',
    tierName: 'PlayStation Plus Essential',
    duration: '12m',
    durationLabel: '12 месяцев (1 год)',
    regionId: 'turkey',
    localAmount: 1400,
    priceByn: 135.00,
    popular: true,
    features: ['Сетевая игра онлайн', '36 бесплатных игр в год', 'Эксклюзивные скидки в PS Store', 'Облачное хранилище']
  },
  {
    id: 'sub-tr-ext-1m',
    tier: 'extra',
    tierName: 'PlayStation Plus Extra',
    duration: '1m',
    durationLabel: '1 месяц',
    regionId: 'turkey',
    localAmount: 260,
    priceByn: 28.50,
    features: ['Все преимущества Essential', 'Каталог из 400+ игр для PS4 и PS5', 'Каталог классики Ubisoft+ Classics', 'Регулярные обновления каталога']
  },
  {
    id: 'sub-tr-ext-3m',
    tier: 'extra',
    tierName: 'PlayStation Plus Extra',
    duration: '3m',
    durationLabel: '3 месяца',
    regionId: 'turkey',
    localAmount: 720,
    priceByn: 74.00,
    features: ['Все преимущества Essential', 'Каталог из 400+ игр для PS4 и PS5', 'Каталог классики Ubisoft+ Classics', 'Регулярные обновления каталога']
  },
  {
    id: 'sub-tr-ext-12m',
    tier: 'extra',
    tierName: 'PlayStation Plus Extra',
    duration: '12m',
    durationLabel: '12 месяцев (1 год)',
    regionId: 'turkey',
    localAmount: 2340,
    priceByn: 225.00,
    popular: true,
    features: ['Все преимущества Essential', 'Каталог из 400+ игр для PS4 и PS5', 'Каталог классики Ubisoft+ Classics', 'Выгода до 30% по сравнению с помесячной оплатой']
  },
  {
    id: 'sub-tr-dlx-12m',
    tier: 'deluxe',
    tierName: 'PlayStation Plus Deluxe',
    duration: '12m',
    durationLabel: '12 месяцев (1 год)',
    regionId: 'turkey',
    localAmount: 2740,
    priceByn: 259.00,
    features: ['Все преимущества Extra и Essential', 'Каталог классических игр PS1, PS2, PSP', 'Пробные версии новых игр (триалы 2-5 часов)', 'Максимальный уровень подписки']
  },

  // Poland
  {
    id: 'sub-pl-ess-12m',
    tier: 'essential',
    tierName: 'PlayStation Plus Essential',
    duration: '12m',
    durationLabel: '12 месяцев (1 год)',
    regionId: 'poland',
    localAmount: 295,
    priceByn: 249.00,
    features: ['Сетевая игра онлайн', '36 бесплатных игр в год', 'Эксклюзивные скидки в PS Store', 'Облачное хранилище']
  },
  {
    id: 'sub-pl-ext-12m',
    tier: 'extra',
    tierName: 'PlayStation Plus Extra',
    duration: '12m',
    durationLabel: '12 месяцев (1 год)',
    regionId: 'poland',
    localAmount: 445,
    priceByn: 375.00,
    popular: true,
    features: ['Все преимущества Essential', 'Каталог из 400+ игр PS4/PS5', 'Русская локализация для европейского региона', 'Каталог Ubisoft+ Classics']
  },
  {
    id: 'sub-pl-dlx-12m',
    tier: 'deluxe',
    tierName: 'PlayStation Plus Premium',
    duration: '12m',
    durationLabel: '12 месяцев (1 год)',
    regionId: 'poland',
    localAmount: 540,
    priceByn: 455.00,
    features: ['Все преимущества Extra', 'Облачный стриминг игр PS3/PS4', 'Каталог классики PS1, PS2, PSP', 'Пробные версии новинок']
  },

  // India
  {
    id: 'sub-in-ext-12m',
    tier: 'extra',
    tierName: 'PlayStation Plus Extra',
    duration: '12m',
    durationLabel: '12 месяцев (1 год)',
    regionId: 'india',
    localAmount: 6699,
    priceByn: 275.00,
    popular: true,
    features: ['Все преимущества Essential', 'Каталог 400+ игр для PS4/PS5', 'Каталог Ubisoft+ Classics', 'Облачные сохранения']
  },

  // Ukraine
  {
    id: 'sub-ua-ext-12m',
    tier: 'extra',
    tierName: 'PlayStation Plus Extra',
    duration: '12m',
    durationLabel: '12 месяцев (1 год)',
    regionId: 'ukraine',
    localAmount: 3199,
    priceByn: 265.00,
    popular: true,
    features: ['Все преимущества Essential', 'Каталог 400+ игр для PS4/PS5', 'Европейские версии с русским языком', 'Ubisoft+ Classics']
  }
];

export const INITIAL_GAMES: GameProduct[] = [
  {
    id: 'game-spiderman-2',
    title: "Marvel's Spider-Man 2",
    publisher: 'PlayStation Studios / Insomniac Games',
    releaseYear: 2023,
    platforms: ['PS5'],
    category: 'bestsellers',
    genres: ['Экшен', 'Приключения', 'Открытый мир'],
    russianLocalization: 'full',
    description: 'Питер Паркер и Майлз Моралес возвращаются в захватывающем приключении для PS5. Исследуйте расширенный Нью-Йорк, переключайтесь между пауками и сразитесь с культовым Веномом.',
    accentColor: '#dc2626',
    gradient: 'from-red-950 via-slate-900 to-black',
    iconSymbol: 'cross',
    rating: 4.9,
    featured: true,
    regionalStorePrices: {
      turkey: 1499,
      poland: 339,
      india: 4999,
      ukraine: 2299
    }
  },
  {
    id: 'game-gta-6',
    title: 'Grand Theft Auto VI',
    publisher: 'Rockstar Games',
    releaseYear: 2025,
    platforms: ['PS5'],
    category: 'preorder',
    genres: ['Экшен', 'Открытый мир', 'Криминал'],
    russianLocalization: 'subtitles',
    description: 'Самый ожидаемый проект десятилетия. Отправляйтесь в штат Леонида, освещённый неоновыми огнями Вайс-Сити, в компании Люсии и Джейсона.',
    accentColor: '#ec4899',
    gradient: 'from-pink-950 via-purple-950 to-black',
    iconSymbol: 'triangle',
    rating: 5.0,
    featured: true,
    regionalStorePrices: {
      turkey: 2799,
      poland: 379,
      india: 5999,
      ukraine: 2799
    }
  },
  {
    id: 'game-ea-fc-25',
    title: 'EA SPORTS FC 25',
    publisher: 'Electronic Arts',
    releaseYear: 2024,
    platforms: ['PS5', 'PS4'],
    category: 'bestsellers',
    genres: ['Спорт', 'Футбол', 'Мультиплеер'],
    russianLocalization: 'full',
    description: 'Новый этап всемирной футбольной игры с технологией FC IQ и режимом 5v5 Rush. Полный состав Ultimate Team и обновлённые турниры.',
    accentColor: '#10b981',
    gradient: 'from-emerald-950 via-slate-900 to-black',
    iconSymbol: 'circle',
    rating: 4.6,
    featured: true,
    regionalStorePrices: {
      turkey: 2899,
      poland: 369,
      india: 4799,
      ukraine: 2499
    }
  },
  {
    id: 'game-silent-hill-2',
    title: 'Silent Hill 2 Remake',
    publisher: 'Konami / Bloober Team',
    releaseYear: 2024,
    platforms: ['PS5'],
    category: 'new',
    genres: ['Хоррор', 'Психологический', 'Выживание'],
    russianLocalization: 'subtitles',
    description: 'Легендарный психологический хоррор, воссозданный с нуля на движке Unreal Engine 5 с невероятной графикой и 3D-звуком Tempest.',
    accentColor: '#78716c',
    gradient: 'from-stone-900 via-neutral-900 to-black',
    iconSymbol: 'square',
    rating: 4.8,
    featured: false,
    regionalStorePrices: {
      turkey: 1999,
      poland: 299,
      india: 4499,
      ukraine: 2199
    }
  },
  {
    id: 'game-astro-bot',
    title: 'Astro Bot',
    publisher: 'PlayStation Studios / Team ASOBI',
    releaseYear: 2024,
    platforms: ['PS5'],
    category: 'new',
    genres: ['Платформер', 'Приключения', 'Для всей семьи'],
    russianLocalization: 'full',
    description: 'Лучший платформер года с максимальным использованием возможностей DualSense. Более 50 планет, спасение потерянных VIP-ботов и чистое веселье.',
    accentColor: '#0ea5e9',
    gradient: 'from-sky-950 via-blue-950 to-black',
    iconSymbol: 'circle',
    rating: 5.0,
    featured: true,
    regionalStorePrices: {
      turkey: 1499,
      poland: 299,
      india: 3999,
      ukraine: 1999
    }
  },
  {
    id: 'game-black-myth-wukong',
    title: 'Black Myth: Wukong',
    publisher: 'Game Science',
    releaseYear: 2024,
    platforms: ['PS5'],
    category: 'bestsellers',
    genres: ['Ролевая игра', 'Экшен', 'Мифология'],
    russianLocalization: 'subtitles',
    description: 'Ролевой экшен по мотивам романа «Путешествие на Запад». Примерьте на себя роль Избранника и раскройте скрытую истину великой легенды.',
    accentColor: '#f59e0b',
    gradient: 'from-amber-950 via-slate-900 to-black',
    iconSymbol: 'triangle',
    rating: 4.9,
    featured: true,
    regionalStorePrices: {
      turkey: 1499,
      poland: 299,
      india: 3999,
      ukraine: 1899
    }
  },
  {
    id: 'game-gow-ragnarok',
    title: 'God of War Ragnarök',
    publisher: 'PlayStation Studios / Santa Monica',
    releaseYear: 2022,
    platforms: ['PS5', 'PS4'],
    category: 'bestsellers',
    genres: ['Экшен', 'Приключения', 'Скандинавская мифология'],
    russianLocalization: 'full',
    description: 'Кратос и Атрей отправляются в Девять миров в поисках ответов, пока армии Асгарда готовятся к войне, которой суждено положить конец свету.',
    accentColor: '#0284c7',
    gradient: 'from-cyan-950 via-slate-900 to-black',
    iconSymbol: 'cross',
    rating: 4.9,
    regionalStorePrices: {
      turkey: 1499,
      poland: 339,
      india: 4999,
      ukraine: 2299
    }
  },
  {
    id: 'game-cyberpunk-2077',
    title: 'Cyberpunk 2077: Ultimate Edition',
    publisher: 'CD PROJEKT RED',
    releaseYear: 2023,
    platforms: ['PS5'],
    category: 'deals',
    genres: ['RPG', 'Киберпанк', 'Открытый мир'],
    russianLocalization: 'full',
    description: 'Полное издание с сюжетным дополнением «Призрачная свобода». Найт-Сити оживает с трассировкой лучей и улучшенным ИИ.',
    accentColor: '#eab308',
    gradient: 'from-yellow-950 via-slate-900 to-black',
    iconSymbol: 'square',
    rating: 4.8,
    regionalStorePrices: {
      turkey: 1199,
      poland: 219,
      india: 3499,
      ukraine: 1699
    },
    originalPriceDiscount: {
      turkey: 1799,
      poland: 299,
      india: 4999,
      ukraine: 2399
    }
  },
  {
    id: 'game-elden-ring-erdtree',
    title: 'Elden Ring: Shadow of the Erdtree',
    publisher: 'FromSoftware / Bandai Namco',
    releaseYear: 2024,
    platforms: ['PS5', 'PS4'],
    category: 'bestsellers',
    genres: ['Souls-like', 'RPG', 'Фэнтези'],
    russianLocalization: 'subtitles',
    description: 'Грандиозное расширение шедевра Миядзаки. Новые земли Теней, чудовищные боссы и десятки новых типов оружия и заклинаний.',
    accentColor: '#ca8a04',
    gradient: 'from-amber-950 via-slate-950 to-black',
    iconSymbol: 'triangle',
    rating: 4.9,
    regionalStorePrices: {
      turkey: 1249,
      poland: 249,
      india: 3299,
      ukraine: 1699
    }
  },
  {
    id: 'game-tlou-part-1',
    title: 'The Last of Us Part I',
    publisher: 'PlayStation Studios / Naughty Dog',
    releaseYear: 2022,
    platforms: ['PS5'],
    category: 'deals',
    genres: ['Драма', 'Стелс', 'Экшен'],
    russianLocalization: 'full',
    description: 'Эмоциональное путешествие Джоэла и Элли в разрушенном мире. Полный графический ремейк на технологиях второй части.',
    accentColor: '#16a34a',
    gradient: 'from-emerald-950 via-neutral-900 to-black',
    iconSymbol: 'circle',
    rating: 4.9,
    regionalStorePrices: {
      turkey: 1099,
      poland: 199,
      india: 2999,
      ukraine: 1499
    },
    originalPriceDiscount: {
      turkey: 1499,
      poland: 339,
      india: 4999,
      ukraine: 2299
    }
  },
  {
    id: 'game-death-stranding-2',
    title: 'Death Stranding 2: On The Beach',
    publisher: 'Sony Interactive / Kojima Productions',
    releaseYear: 2025,
    platforms: ['PS5'],
    category: 'preorder',
    genres: ['Кинематографичный экшен', 'Фантастика'],
    russianLocalization: 'subtitles',
    description: 'Новый авторский проект Хидэо Кодзимы с Норманом Ридусом и Леа Сейду. Должны ли мы были связываться?',
    accentColor: '#64748b',
    gradient: 'from-slate-900 via-zinc-900 to-black',
    iconSymbol: 'cross',
    rating: 4.9,
    regionalStorePrices: {
      turkey: 2799,
      poland: 349,
      india: 5499,
      ukraine: 2699
    }
  },
  {
    id: 'game-hogwarts-legacy',
    title: 'Hogwarts Legacy',
    publisher: 'Warner Bros. Games / Avalanche',
    releaseYear: 2023,
    platforms: ['PS5', 'PS4'],
    category: 'deals',
    genres: ['RPG', 'Открытый мир', 'Магия'],
    russianLocalization: 'subtitles',
    description: 'Погрузитесь в Хогвартс XIX века. Варите зелья, летайте на метле и раскройте древнюю магическую тайну волшебного мира.',
    accentColor: '#9333ea',
    gradient: 'from-purple-950 via-slate-900 to-black',
    iconSymbol: 'square',
    rating: 4.7,
    regionalStorePrices: {
      turkey: 899,
      poland: 179,
      india: 2699,
      ukraine: 1299
    },
    originalPriceDiscount: {
      turkey: 1799,
      poland: 319,
      india: 4499,
      ukraine: 2299
    }
  }
];

export const INITIAL_DIGITAL_CODES: DigitalCode[] = [
  // Turkey codes
  { id: 'code-tr-001', code: '4X7K-9M2L-8PQW', regionId: 'turkey', productType: 'gift_card', denomination: 500, title: 'PS Store 500 TRY', status: 'available', createdAt: '2026-10-10' },
  { id: 'code-tr-002', code: '9BL2-4V8P-7Q1M', regionId: 'turkey', productType: 'gift_card', denomination: 500, title: 'PS Store 500 TRY', status: 'available', createdAt: '2026-10-10' },
  { id: 'code-tr-003', code: '2TK8-5NR9-1WQ7', regionId: 'turkey', productType: 'gift_card', denomination: 1000, title: 'PS Store 1000 TRY', status: 'available', createdAt: '2026-10-10' },
  { id: 'code-tr-004', code: '8LQ4-3MX7-6BV9', regionId: 'turkey', productType: 'gift_card', denomination: 1000, title: 'PS Store 1000 TRY', status: 'available', createdAt: '2026-10-10' },
  { id: 'code-tr-005', code: '7KP9-2RT5-4WX8', regionId: 'turkey', productType: 'gift_card', denomination: 1500, title: 'PS Store 1500 TRY', status: 'available', createdAt: '2026-10-10' },
  { id: 'code-tr-006', code: '5MN3-8PQ2-9RT6', regionId: 'turkey', productType: 'gift_card', denomination: 2000, title: 'PS Store 2000 TRY', status: 'available', createdAt: '2026-10-10' },
  { id: 'code-tr-007', code: '3XB9-7LK4-2NM8', regionId: 'turkey', productType: 'gift_card', denomination: 250, title: 'PS Store 250 TRY', status: 'available', createdAt: '2026-10-10' },
  { id: 'code-tr-008', code: '9QP8-1RT7-4KV2', regionId: 'turkey', productType: 'subscription', denomination: 1400, title: 'PS Plus Essential 12 мес (Турция)', status: 'available', createdAt: '2026-10-10' },
  { id: 'code-tr-009', code: '6MX2-5TL9-3RQ8', regionId: 'turkey', productType: 'subscription', denomination: 2340, title: 'PS Plus Extra 12 мес (Турция)', status: 'available', createdAt: '2026-10-10' },

  // Poland codes
  { id: 'code-pl-001', code: '8PL3-9QK5-2MN7', regionId: 'poland', productType: 'gift_card', denomination: 100, title: 'PS Store 100 PLN', status: 'available', createdAt: '2026-10-10' },
  { id: 'code-pl-002', code: '4WK7-1NP8-6TV2', regionId: 'poland', productType: 'gift_card', denomination: 200, title: 'PS Store 200 PLN', status: 'available', createdAt: '2026-10-10' },
  { id: 'code-pl-003', code: '7RT2-4MX9-5LQ8', regionId: 'poland', productType: 'gift_card', denomination: 50, title: 'PS Store 50 PLN', status: 'available', createdAt: '2026-10-10' },

  // India codes
  { id: 'code-in-001', code: '5IN8-3PQ9-7KL2', regionId: 'india', productType: 'gift_card', denomination: 1000, title: 'PS Store 1000 INR', status: 'available', createdAt: '2026-10-10' },
  { id: 'code-in-002', code: '2MN7-8TV4-1WQ5', regionId: 'india', productType: 'gift_card', denomination: 2000, title: 'PS Store 2000 INR', status: 'available', createdAt: '2026-10-10' },

  // Ukraine codes
  { id: 'code-ua-001', code: '9UA4-5LQ7-2RT8', regionId: 'ukraine', productType: 'gift_card', denomination: 500, title: 'PS Store 500 UAH', status: 'available', createdAt: '2026-10-10' },
  { id: 'code-ua-002', code: '3KL8-9MN2-6PQ5', regionId: 'ukraine', productType: 'gift_card', denomination: 1000, title: 'PS Store 1000 UAH', status: 'available', createdAt: '2026-10-10' }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-10481',
    orderNumber: 'PS-10481',
    createdAt: '2026-10-11 14:22',
    customerName: 'Дмитрий Ковалёв',
    telegramUsername: '@dmitry_minsk',
    phone: '+375 (29) 682-14-30',
    email: 'dmitry.minsk@gmail.com',
    regionId: 'turkey',
    totalByn: 142.00,
    paymentMethod: 'erip',
    paymentReference: 'ERIP-892401',
    receiptNote: 'Оплачено через Беларусбанк ЕРИП код 49201',
    status: 'completed',
    items: [
      {
        id: 'cart-1',
        type: 'gift_card',
        title: 'Карта пополнения PS Store 1000 ₺ (Турция)',
        regionId: 'turkey',
        denomination: 1000,
        currencySymbol: '₺',
        priceByn: 94.00,
        quantity: 1,
        gameTitle: "Marvel's Spider-Man 2"
      },
      {
        id: 'cart-2',
        type: 'gift_card',
        title: 'Карта пополнения PS Store 500 ₺ (Турция)',
        regionId: 'turkey',
        denomination: 500,
        currencySymbol: '₺',
        priceByn: 48.00,
        quantity: 1,
        gameTitle: "Marvel's Spider-Man 2"
      }
    ],
    issuedCodes: [
      {
        itemTitle: 'Карта пополнения PS Store 1000 ₺ (Турция)',
        code: '2TK8-5NR9-1WQ7',
        denomination: 1000,
        currencySymbol: '₺'
      },
      {
        itemTitle: 'Карта пополнения PS Store 500 ₺ (Турция)',
        code: '4X7K-9M2L-8PQW',
        denomination: 500,
        currencySymbol: '₺'
      }
    ],
    adminNotes: 'Проверено, выписка совпадает. Коды отправлены.'
  },
  {
    id: 'ord-10482',
    orderNumber: 'PS-10482',
    createdAt: '2026-10-11 15:45',
    customerName: 'Максим Леонов',
    telegramUsername: '@max_brest',
    phone: '+375 (33) 314-55-90',
    regionId: 'turkey',
    totalByn: 225.00,
    paymentMethod: 'oplati',
    paymentReference: 'OPL-930124',
    receiptNote: 'Оплати QR чек №930124',
    status: 'verifying',
    items: [
      {
        id: 'cart-3',
        type: 'subscription',
        title: 'PS Plus Extra 12 месяцев (Турция)',
        regionId: 'turkey',
        duration: '12m',
        priceByn: 225.00,
        quantity: 1
      }
    ],
    issuedCodes: [],
    adminNotes: 'Ожидает сверки выписки по Оплати'
  }
];

export const REGION_GUIDES = {
  turkey: {
    title: 'Как покупать игры через регион Турция (₺)',
    steps: [
      'Создайте новый аккаунт PSN на консоли или на сайте playstation.com, выбрав страну Turkey (Турция). VPN не требуется.',
      'Привяжите аккаунт к вашей консоли PS5 или PS4 как дополнительный пользователь.',
      'Приобретите карты пополнения баланса PS Store (TRY) в нашем магазине с оплатой в BYN.',
      'На консоли перейдите в PlayStation Store → Меню (...) → Redeem Code (Погашение кодов) и введите полученный 12-значный код.',
      'Средства мгновенно поступят на кошелёк аккаунта. Найдите желаемую игру и нажмите Buy.',
      'После загрузки включите «Общий доступ к консоли и автономную игру» (Console Sharing) — и играйте со своего основного белорусского профиля с трофеями и сохранениями!'
    ]
  },
  poland: {
    title: 'Как покупать игры через регион Польша (zł)',
    steps: [
      'Создайте аккаунт PSN со страной Poland (Польша).',
      'Главный плюс польского региона — 100% наличие русской озвучки и текста во всех эксклюзивах Sony.',
      'Пополните кошелёк с помощью польских подарочных карт в злотых (PLN).',
      'Код активируется в меню Redeem Code. Игру можно скачивать сразу после покупки.'
    ]
  },
  india: {
    title: 'Как покупать игры через регион Индия (₹)',
    steps: [
      'Создайте аккаунт PSN с регионом India.',
      'Подарочные карты в рупиях (INR) активируются мгновенно через Redeem Code.',
      'Почти все новинки имеют русскую локализацию.'
    ]
  },
  ukraine: {
    title: 'Как покупать игры через регион Украина (₴)',
    steps: [
      'Создайте аккаунт PSN с регионом Ukraine (Украина).',
      'Европейский каталог с максимальной локализацией.',
      'Активируйте код пополнения UAH и покупайте игры без ограничений.'
    ]
  }
};
