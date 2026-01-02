<div align="center">
  <img src="public/ozon-logo.png" alt="OZON Logo" width="280" />
  
  ## Ozon Support Templates
  
  **Система управления шаблонами ответов для сотрудников чата поддержки Ozon**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
</div>

---

## О проекте

OST — внутренний инструмент для операторов чата поддержки Ozon, позволяющий быстро находить и копировать готовые шаблоны ответов. Приложение помогает сократить время ответа клиентам и стандартизировать коммуникацию.

## Возможности

- **Организация шаблонов** — создание папок и подпапок для структурирования шаблонов по категориям
- **Быстрое копирование** — копирование текста шаблона в один клик
- **Поиск** — мгновенный поиск по названию и содержимому шаблонов
- **Редактирование** — создание, изменение и удаление шаблонов прямо в интерфейсе
- **Темная тема** — переключение между светлой и темной темой
- **Авторизация** — личные шаблоны для каждого сотрудника

## Технологии

| Технология | Назначение |
|------------|------------|
| Next.js 16 | Фреймворк |
| MongoDB Atlas | База данных |
| Tailwind CSS | Стилизация |
| shadcn/ui | UI-компоненты |
| bcrypt | Хеширование паролей |

## Установка

### 1. Клонирование репозитория

```bash
git clone https://github.com/IvanWake/ozon-support-app.git
cd ozon-support-templates
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
MONGODB_URI=Ваша база монго
```

### 4. Запуск

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## Структура проекта

```
├── app/
│   ├── api/
│   │   ├── auth/          # Эндпоинты авторизации
│   │   ├── folders/       # CRUD папок
│   │   └── templates/     # CRUD шаблонов
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth-form.tsx      # Форма входа/регистрации
│   ├── folder-tree.tsx    # Дерево папок
│   ├── template-list.tsx  # Список шаблонов
│   ├── template-editor.tsx # Редактор шаблона
│   └── templates-app.tsx  # Главный компонент
└── lib/
    ├── mongodb.ts         # Подключение к БД
    ├── types.ts           # TypeScript типы
    └── api.ts             # API клиент
```

## API

### Авторизация

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/api/auth/login` | Вход в систему |
| POST | `/api/auth/register` | Регистрация |

### Шаблоны

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/api/templates?userId=` | Получить все шаблоны |
| POST | `/api/templates` | Создать шаблон |
| PUT | `/api/templates` | Обновить шаблон |
| DELETE | `/api/templates?id=` | Удалить шаблон |

### Папки

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/api/folders?userId=` | Получить все папки |
| POST | `/api/folders` | Создать папку |
| PUT | `/api/folders` | Обновить папку |
| DELETE | `/api/folders?id=` | Удалить папку |

---

<div align="center">
  <sub>Разработано для команды поддержки Ozon</sub><br>
  by <a href="https://t.me/ivanwakedev">Тимофеев Иван</a>
</div>
