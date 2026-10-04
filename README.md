# Iswarah Website

The storefront for [Iswarah](https://www.iswarah.com), a registered nonprofit
that sells apparel and accessories and donates 100% of the profits to
Palestinian humanitarian aid. This is a rebuild of the shop: a product catalog
with category, size, and price filtering, backed by a Django REST API with an
admin dashboard for managing inventory and orders.

**Status:** in development. The catalog, filters, and admin are working; cart
and checkout are in progress.

## Features

- Product catalog with per-product pages
- Filter by category, size, and price range (the price slider and size list
  update to match the selected category)
- Admin dashboard (Django admin with the Jazzmin theme) for products,
  categories, sizes, and drag-to-reorder size ordering
- JWT login through NextAuth
- Order and order-item models with a profit-by-category report

## Tech stack

| Layer    | Tools                                                        |
|----------|--------------------------------------------------------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, NextAuth     |
| Backend  | Django 5.2, Django REST Framework, SimpleJWT, django-filter  |
| Database | SQLite in development                                        |

## Project structure

```
backend/
  backend/        Django project settings and URLs
  products/       Product, Category, Size models, filters, and API
  transactions/   Order models and reporting
  users/          User management
frontend/
  pages/          Next.js pages (home, shop, product detail, login)
  pages/components/shopComponents/   Catalog grid and filters
```

## Running locally

### Backend

```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cd backend
python manage.py migrate
python manage.py createsuperuser  # for the admin dashboard
python manage.py runserver        # http://localhost:8000
```

Add products, categories, and sizes at `http://localhost:8000/admin`.

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev                       # http://localhost:3000
```

The backend must be running for the shop pages to load.

## API

| Endpoint                     | Description                                  |
|------------------------------|----------------------------------------------|
| `GET /api/products/`         | List products; supports filter query params  |
| `GET /api/products/<slug>/`  | Product detail                               |
| `GET /api/categories/`       | List categories                              |
| `GET /api/sizes/`            | List sizes                                   |
| `GET /api/price-range/`      | Min and max price for the current filters    |
| `GET /api/catSizeRange/`     | Sizes available for the selected categories  |
| `POST /api/token/`           | Obtain a JWT access and refresh token        |

## Team

Built by Saurav Kandel and Afaf Maliha.
