# Headless E-commerce Backend API Documentation

## Interactive API Documentation (Swagger)

This project provides comprehensive API documentation using Swagger UI with OpenAPI 3.0.

### Access Documentation

- **Local Development**: http://localhost:3000/api-docs
- **Production**: Update server URL in `src/config/swagger.config.ts`

### Features

- Interactive API testing directly in browser
- Complete request/response schemas
- Authentication examples with `x-cart-token` header
- Organized by modules: Image, Category, Product, Variant, Promo, Cart, Order, Seed

### Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open http://localhost:3000/api-docs

## Table of Contents

- [Auth Routes](#auth-routes)

## Auth Routes

<!--
# Authentication Module API Documentation

This module provides endpoints for user authentication and account management.

## Endpoints

- **POST /auth/login**
    Authenticates a user with provided credentials and returns an access token.

- **POST /auth/logout**
    Logs out the currently authenticated user and invalidates their session/token.

- **GET /auth/get-me**
    Retrieves the profile information of the currently authenticated user.

- **PUT /auth/change-password**
    Allows the authenticated user to change their password by providing the current and new passwords.

- **POST /auth/forgot-password**
    Initiates the password reset process by sending a reset link or code to the user's registered email address.

- **POST /auth/reset-password**
    Completes the password reset process by setting a new password using the reset token or code.

## Notes

- All endpoints (except `/auth/login` and `/auth/forgot-password`, `/auth/reset-password`) require authentication via a valid access token.
- Ensure to use HTTPS to protect sensitive information during transmission.
-->
