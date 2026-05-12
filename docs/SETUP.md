# Setup Instructions

## 1. Install dependencies
```bash
composer install
npm install
```

## 2. Configure environment
```bash
cp .env.example .env
php artisan key:generate
```

Set DB values in `.env` for MySQL.

## 3. Install Breeze (React + Inertia)
```bash
php artisan breeze:install react
npm install
npm run build
```

## 4. Run migrations and seeders
```bash
php artisan migrate --seed
php artisan storage:link
```

## 5. Run app
```bash
php artisan serve
npm run dev
```

## 6. Default demo admin
- Email: admin@skillswap.test
- Password: password

## Optional real-time chat
1. Configure broadcasting with Pusher or Laravel Reverb
2. Set `BROADCAST_DRIVER` in `.env`
3. Replace polling in chat view with Echo subscriptions
