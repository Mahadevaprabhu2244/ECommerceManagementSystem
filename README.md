# E-Commerce Management System

A full-stack internship starter project built with **Java 21, Spring Boot, MySQL, React, and Vite**.
The UI uses a dark theme with gold accents.

## Features included

- Product catalogue with search and category filtering
- Product details and stock display
- Shopping cart (persisted in browser localStorage)
- Checkout and order creation
- Order history
- Admin product management (create, edit, delete)
- REST API with Spring Data JPA
- MySQL database integration
- Responsive dark/gold UI

> **Important security note:** This is an educational MVP. Admin endpoints are not yet protected by authentication/authorization. Do not deploy it publicly or use real customer/payment data until proper Spring Security authentication, authorization, validation, rate limiting, and payment-provider integration have been added.

## Requirements

- JDK 21
- Maven 3.9+ (or use the included Maven wrapper if you generate one)
- MySQL 8+
- Node.js 20.19+ or 22.12+
- npm

## 1. Create the database

Open MySQL Workbench or the MySQL command line and run:

```sql
CREATE DATABASE ecommerce_db;
```

## 2. Configure the backend

Open `ecommerce-backend/src/main/resources/application.properties`.

Set your own MySQL username and password:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

The application uses `ddl-auto=update` for development, so JPA creates/updates tables automatically.

## 3. Run the backend

In a terminal:

```bash
cd ecommerce-backend
mvn spring-boot:run
```

Backend URL: http://localhost:8080

Health check: http://localhost:8080/api/health

The first run seeds sample categories and products if the product table is empty.

## 4. Run the frontend

Open a second terminal:

```bash
cd ecommerce-frontend
npm install
npm run dev
```

Frontend URL: http://localhost:5173

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/categories` | List categories |
| GET | `/api/products` | List products; optional `?search=` and `?categoryId=` |
| GET | `/api/products/{id}` | Product details |
| POST | `/api/products` | Create product (admin demo) |
| PUT | `/api/products/{id}` | Update product (admin demo) |
| DELETE | `/api/products/{id}` | Delete product (admin demo) |
| POST | `/api/orders` | Create an order |
| GET | `/api/orders/{id}` | Get order details |
| GET | `/api/orders` | List orders; optional `?email=` |

## Example product JSON

```json
{
  "name": "Classic Watch",
  "description": "Minimal everyday watch with a stainless-steel finish.",
  "price": 2499.00,
  "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  "stock": 12,
  "categoryId": 1
}
```

## Example order JSON

```json
{
  "customerName": "Demo Customer",
  "email": "demo@example.com",
  "phone": "9876543210",
  "address": "Mysuru, Karnataka",
  "items": [
    { "productId": 1, "quantity": 2 }
  ]
}
```

## Project structure

```text
ECommerceManagementSystem/
├── ecommerce-backend/
│   ├── src/main/java/com/ecommerce/backend/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   └── service/
│   └── src/main/resources/application.properties
├── ecommerce-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── styles.css
│   └── package.json
└── README.md
```

## Suggested next internship enhancements

1. Add Spring Security with BCrypt and role-based access (CUSTOMER / ADMIN).
2. Replace demo checkout with a payment gateway sandbox.
3. Add image upload instead of external image URLs.
4. Add pagination, sorting, and product reviews.
5. Add unit/integration tests and Docker deployment.
