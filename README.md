# Headless E-commerce Backend

> A modern, scalable e-commerce backend API built with Node.js, Express, TypeScript, Prisma, and MongoDB. Features comprehensive Swagger documentation, cart management, product catalog, order processing, and more.

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 16.x
- **MongoDB** database
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/RuhulAmin3/headless-e-commerce-backend
cd headless-e-commerce-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and other configurations

# Generate Prisma client
npm run postinstall

# Start development server
npm run dev
```

### 🌐 Access Points Locally

- **API Base URL**: http://localhost:3000/api/v1
- **Interactive API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000

### 🌐 Access Points Deployed

- **API Base URL**: https://headless-e-commerce-backend.onrender.com/api/v1
- **Interactive API Documentation**: https://headless-e-commerce-backend.onrender.com/api-docs
- **Health Check**: https://headless-e-commerce-backend.onrender.com

## 📚 API Documentation

### Interactive Swagger UI

Access the complete API documentation at **https://headless-e-commerce-backend.onrender.com/api-docs/**

**Features:**

- 🔍 Interactive API testing
- 📝 Complete request/response schemas
- 🔐 Cart authentication with `x-cart-token` header
- 🏷️ Organized by modules with detailed examples
- ✅ Real-time validation and error responses

## 📋 Available APIs

### 🖼️ Image Management (`/file`)

- `POST /file` - Upload single image
- `POST /file/multiple` - Upload multiple images (max 10)
- `DELETE /file/delete` - Delete single image
- `DELETE /file/delete-multiple` - Delete multiple images

### 📂 Categories (`/categories`)

- `GET /categories` - List categories (with pagination & search)
- `POST /categories` - Create category
- `GET /categories/{id}` - Get category by ID
- `PATCH /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category

**Query Parameters:**

- `page`, `limit`, `sortBy`, `sortOrder`, `searchTerm`

### 🛍️ Products (`/products`)

- `GET /products` - List products (with advanced filtering)
- `POST /products` - Create product with variants
- `GET /products/{id}` - Get product by ID
- `PATCH /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

**Query Parameters:**

- `page`, `limit`, `sortBy`, `sortOrder`, `searchTerm`
- `isFeatured`, `categoryId`, `variant`, `minPrice`, `maxPrice`

### 🎨 Variants (`/variants`)

- `GET /variants` - List all variants
- `POST /variants` - Create variant
- `GET /variants/{id}` - Get variant by ID
- `PATCH /variants/{id}` - Update variant
- `DELETE /variants/{id}` - Delete variant

### 🎫 Promotions (`/promos`)

- `GET /promos` - List promos (with search & pagination)
- `POST /promos` - Create promo code
- `GET /promos/{id}` - Get promo by ID
- `PATCH /promos/{id}` - Update promo
- `DELETE /promos/{id}` - Delete promo
- `POST /promos/apply` - Test promo calculation

**Query Parameters:**

- `page`, `limit`, `sortBy`, `sortOrder`, `searchTerm`, `code`

### 🛒 Shopping Cart (`/cart`) 🔐

> **Note: All cart endpoints require `x-cart-token` authentication**

- `GET /cart` - Get current cart
- `POST /cart` - Add item to cart
- `PATCH /cart/update-quantity/{cartItemId}` - Update item quantity
- `DELETE /cart/remove/{cartItemId}` - Remove item from cart
- `POST /cart/apply-promo` - Apply promo code
- `DELETE /cart/remove-promo` - Remove promo code
- `POST /cart/checkout` - Checkout and create order

### 📦 Orders (`/orders`)

- `GET /orders` - List orders (with filtering)
- `GET /orders/analytics` - Order analytics & statistics
- `GET /orders/{id}` - Get order by ID
- `PATCH /orders/{id}/status` - Update order status
- `PATCH /orders/{id}/cancel` - Cancel order
- `DELETE /orders/{id}` - Delete order

**Query Parameters:**

- `page`, `limit`, `sortBy`, `sortOrder`, `status`, `searchTerm`

**Order Statuses:**

- `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`

### 🌱 Database Seeding (`/seed`)

- `POST /seed` - Seed database with sample data

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier

# Database
npm run postinstall     # Generate Prisma client

# Documentation
npm run swagger:validate # Validate Swagger documentation

# Utilities
npm run generate        # Generate new module scaffolding
```

## 🏗️ Technology Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Prisma ORM
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI 3.0
- **File Upload**: Multer + AWS S3/Cloudinary
- **Authentication**: Cart Token System
- **Logging**: Winston
- **Code Quality**: ESLint + Prettier + Husky

## 🗄️ Database Models

- **Category**: Product categories with images
- **Product**: Products with variants and category relations
- **Variant**: Product variations (size, color, etc.)
- **Cart**: Shopping cart with items and promo codes
- **CartItem**: Individual cart items with quantities
- **Promo**: Promotional codes with usage limits
- **Order**: Customer orders with items and status
- **OrderItem**: Individual order line items

## 🔐 Authentication

### Cart Authentication

Cart operations require a cart session token:

```bash
# Add to request headers
x-cart-token: your-cart-session-token
```

**How to get a cart token:**

1. Make any cart operation (GET /cart)
2. Server will create a cart session and return token
3. Use this token for subsequent cart operations

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables

```env
# Database
DATABASE_URL="mongodb://localhost:27017/headless-ecommerce"

# Server
PORT=3000
NODE_ENV=development

# AWS S3 (Alternative)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_REGION=your_region

```

## 📖 API Usage Examples

### Create a Product

```javascript
const response = await fetch("http://localhost:3000/api/v1/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "iPhone 15 Pro",
    description: "Latest iPhone with advanced features",
    categoryId: "category-id-here",
    isFeatured: true,
    images: ["https://example.com/iphone.jpg"],
    variants: [
      { name: "128GB - Silver", price: 999.99, stock: 50, isDefault: true },
      { name: "256GB - Space Black", price: 1199.99, stock: 25 },
    ],
  }),
});
```

### Add Item to Cart

```javascript
const response = await fetch("http://localhost:3000/api/v1/cart", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-cart-token": "your-cart-token",
  },
  body: JSON.stringify({
    variantId: "variant-id-here",
    quantity: 2,
  }),
});
```

### Search Products

```javascript
const response = await fetch(
  "http://localhost:3000/api/v1/products?searchTerm=iphone&isFeatured=true&minPrice=500&maxPrice=1500&page=1&limit=10",
);
```

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Update Swagger documentation for new endpoints

## 👥 Author

**Ruhul Amin** - Backend Developer

---

## 🔗 Quick Links

- [📖 API Documentation](https://headless-e-commerce-backend.onrender.com/api-docs/) - Interactive Swagger UI
