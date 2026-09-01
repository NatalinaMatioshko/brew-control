# Brew Control

Внутрішня веб-аплікація для кав’ярні: публічне меню й захищена адмінка. Стек: Next.js App Router, Prisma 7, PostgreSQL (Supabase), Auth.js v5.

## Локальне налаштування

1. Встановіть залежності:

```bash
npm install
```

2. Скопіюйте `.env.example` у `.env.local` і заповніть плейсхолдери (`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_URL`, `ADMIN_EMAIL`). Не комітьте реальні секрети.

3. Згенеруйте Prisma Client:

```bash
npx prisma generate
```

4. Застосуйте міграції до бази (лише коли свідомо готові змінити Supabase):

```bash
npx prisma migrate dev
```

CLI використовує `DIRECT_URL` з `prisma.config.ts`. Runtime застосунку використовує `DATABASE_URL`.

5. Створіть першого ADMIN (invite-only; скрипт не запускається автоматично):

```bash
npm run db:seed-admin
```

Скрипт читає `ADMIN_EMAIL` з `.env` / `.env.local`, робить upsert за email, ставить `role = ADMIN` і `isActive = true`. Gmail у код не записуйте.

6. Запустіть застосунок:

```bash
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000).

## Вхід через Google

Увійти може лише користувач, який уже є в таблиці `users` і має `isActive = true`. Новий Google-акаунт **не** створює рядок `User`.

Щоб перевірити відмову: увійдіть іншим Google-акаунтом, якого немає в `users`. Очікуйте `AccessDenied` (редірект на `/` з `?error=AccessDenied`).

Google Cloud redirect URI:

```
http://localhost:3000/api/auth/callback/google
```
