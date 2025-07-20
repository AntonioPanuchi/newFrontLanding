# SEO Улучшения ROX.VPN

## 🎯 Проблема

До внесения изменений все страницы сайта имели одинаковый заголовок "ROX.VPN", что негативно влияло на:

- **SEO**: Поисковые системы не могли различать страницы
- **UX**: При добавлении в закладки все страницы выглядели одинаково
- **Шаринг**: При публикации ссылок в соцсетях не было контекста

## ✅ Решение

### 1. Динамические заголовки страниц

Каждая страница теперь имеет уникальный заголовок:

- **Главная**: `ROX.VPN – VPN за 30 секунд прямо в Telegram`
- **Серверы**: `Статус серверов – ROX.VPN`
- **FAQ**: `Часто задаваемые вопросы – ROX.VPN`

### 2. Компонент PageHead

Создан переиспользуемый компонент для управления SEO:

```tsx
<PageHead
  title="Статус серверов"
  description="Мониторинг статуса VPN серверов ROX.VPN в реальном времени..."
  path="/servers"
/>
```

**Особенности:**

- Автоматически добавляет "– ROX.VPN" к заголовку
- Генерирует полный URL для canonical и Open Graph
- Поддерживает `noIndex` для приватных страниц

### 3. Мета-теги

Добавлены все необходимые SEO мета-теги:

#### Open Graph

```html
<meta property="og:title" content="Статус серверов – ROX.VPN" />
<meta property="og:description" content="Мониторинг статуса VPN серверов..." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://rx-test.ru/servers" />
<meta property="og:site_name" content="ROX.VPN" />
```

#### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Статус серверов – ROX.VPN" />
<meta name="twitter:description" content="Мониторинг статуса VPN серверов..." />
<meta name="twitter:site" content="@ROX_VPN" />
```

#### Canonical URL

```html
<link rel="canonical" href="https://rx-test.ru/servers" />
```

### 4. Базовые мета-теги

Обновлен `index.html` с базовыми SEO тегами:

```html
<meta
  name="description"
  content="Забудь про сложные настройки! ROX.VPN работает через Telegram-бота..."
/>
<meta
  name="keywords"
  content="VPN, Telegram, безопасность, интернет, защита, ROX.VPN"
/>
<meta name="author" content="ROX.VPN" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://rx-test.ru" />
```

## 📊 Результаты

### SEO улучшения

- ✅ Уникальные заголовки для каждой страницы
- ✅ Оптимизированные meta descriptions
- ✅ Правильные canonical URLs
- ✅ Open Graph для соцсетей
- ✅ Twitter Card для Twitter

### UX улучшения

- ✅ Понятные заголовки в закладках
- ✅ Контекст при шаринге ссылок
- ✅ Улучшенная навигация в браузере

### Технические улучшения

- ✅ Переиспользуемый компонент PageHead
- ✅ TypeScript типизация
- ✅ Storybook документация
- ✅ Автоматическое форматирование заголовков

## 🛠️ Использование

### Добавление новой страницы

1. Создайте компонент страницы
2. Добавьте PageHead:

```tsx
import PageHead from "../components/PageHead";

const NewPage: React.FC = () => (
  <>
    <PageHead
      title="Название страницы"
      description="Описание страницы для SEO"
      path="/new-page"
    />
    {/* Контент страницы */}
  </>
);
```

### Приватные страницы

```tsx
<PageHead
  title="Приватная страница"
  description="Описание"
  path="/private"
  noIndex={true}
/>
```

## 📈 Мониторинг

### Google Search Console

- Отслеживайте индексацию новых страниц
- Проверяйте canonical URLs
- Анализируйте CTR по заголовкам

### Социальные сети

- Тестируйте Open Graph в Facebook Debugger
- Проверяйте Twitter Card в Twitter Card Validator
- Убедитесь в корректном отображении превью

### Lighthouse

- Проверяйте SEO score
- Убедитесь в наличии всех мета-тегов
- Оптимизируйте Core Web Vitals

## 🔄 Дальнейшие улучшения

### Возможные дополнения

- [ ] Структурированные данные (JSON-LD)
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Аналитика событий
- [ ] A/B тестирование заголовков

### Мониторинг

- [ ] Google Analytics 4
- [ ] Яндекс.Метрика
- [ ] Hotjar для UX аналитики
- [ ] Мониторинг Core Web Vitals

## 📚 Ресурсы

- [Google SEO Guide](https://developers.google.com/search/docs)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
