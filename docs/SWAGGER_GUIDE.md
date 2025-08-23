# Swagger API Documentation Guide

## Overview

This project uses **Swagger UI** with **OpenAPI 3.0** to provide comprehensive API documentation. The documentation is automatically generated from JSDoc annotations in route files and centralized schema definitions.

## Accessing Documentation

### Local Development

- **URL**: http://localhost:3000/api-docs
- **Prerequisites**:
  - Run `npm install` to install dependencies
  - Run `npm run dev` to start the development server

### Production

- Update the server URL in `src/config/swagger.config.ts` to match your production domain
- Access via `https://headless-e-commerce-backend.onrender.com/api-docs/`

## Project Structure

```
src/
├── config/
│   ├── swagger.config.ts      # Main Swagger configuration
│   └── swagger.definitions.ts # Centralized schema definitions
├── app/modules/
│   └── */
│       └── *.routes.ts        # Route files with JSDoc annotations
└── app.ts                     # Swagger UI setup
```

## Features

### 🏷️ **Organized by Tags**

- **Image**: File upload and deletion operations
- **Category**: Product categories management
- **Product**: Product catalog operations
- **Variant**: Product variants (size, color, etc.)
- **Promo**: Promotional codes and discounts
- **Cart**: Shopping cart operations
- **Order**: Order management and analytics
- **Seed**: Database seeding for development

### 🔐 **Authentication**

- Global API key authentication using `x-cart-token` header
- All endpoints are secured by default
- Test directly in the Swagger UI interface

### 📋 **Reusable Components**

- Common query parameters for pagination
- Standard error response schemas
- Request/response models aligned with Prisma schema

## How to Add Documentation for New Endpoints

### 1. Route Documentation

Add JSDoc comments above your route handlers:

```typescript
/**
 * @swagger
 * /api/v1/your-endpoint:
 *   post:
 *     summary: Brief description of the endpoint
 *     tags: [YourModule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourRequestSchema'
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourResponseSchema'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/your-endpoint", yourController.yourMethod);
```

### 2. Schema Definitions

Add new schemas to `src/config/swagger.definitions.ts`:

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     YourSchema:
 *       type: object
 *       required:
 *         - requiredField
 *       properties:
 *         requiredField:
 *           type: string
 *           description: Description of the field
 *         optionalField:
 *           type: number
 *           example: 123
 */
```

### 3. Using Reusable Parameters

Reference common parameters in your endpoint documentation:

```typescript
/**
 * @swagger
 * /api/v1/your-endpoint:
 *   get:
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchTermParam'
 */
```

## Available Reusable Components

### Parameters

- `PageParam`: Page number for pagination
- `LimitParam`: Items per page (1-100)
- `SortByParam`: Field to sort by
- `SortOrderParam`: Sort order (asc/desc)
- `SearchTermParam`: Text search term

### Schemas

- `ErrorResponse`: Standard error response format
- `SuccessResponse`: Standard success response format
- All entity schemas (Cart, Product, Category, etc.)
- Request schemas (CreateProductRequest, UpdateCategoryRequest, etc.)

## Validation

Run the validation script to check your Swagger setup:

```bash
node scripts/validate-swagger.js
```

This will:

- Generate the complete OpenAPI specification
- Count endpoints and schemas
- Write the spec to `swagger-spec.json` for inspection
- Report any errors

## Best Practices

### 1. **Consistent Naming**

- Use PascalCase for schema names: `CreateProductRequest`
- Use descriptive endpoint summaries
- Group related endpoints with consistent tags

### 2. **Complete Documentation**

- Document all request/response schemas
- Include example values where helpful
- Add parameter descriptions
- Document error responses

### 3. **Schema Alignment**

- Keep Swagger schemas aligned with Prisma models
- Use the same field types and constraints
- Update documentation when database schema changes

### 4. **Error Handling**

- Use standard error response schemas
- Document all possible HTTP status codes
- Include meaningful error messages

## Troubleshooting

### Common Issues

1. **Endpoints not appearing**

   - Check JSDoc syntax in route files
   - Ensure route files are in the correct path pattern
   - Verify the `apis` configuration in `swagger.config.ts`

2. **Schema not found errors**

   - Check schema names match exactly (case-sensitive)
   - Ensure schemas are defined in `swagger.definitions.ts`
   - Validate JSDoc syntax

3. **Authentication not working**
   - Ensure `x-cart-token` header is set correctly
   - Check security configuration in `swagger.config.ts`
   - Verify the header name matches your middleware

### Development Tips

- Use the "Try it out" feature in Swagger UI to test endpoints
- Check browser developer tools for detailed error messages
- Generate and inspect the raw OpenAPI spec using the validation script
- Keep documentation close to code for better maintenance

## Future Enhancements

Consider adding:

- Response examples with real data
- Additional authentication schemes (Bearer tokens, OAuth)
- API versioning support
- Rate limiting documentation
- Webhook documentation
- SDK generation from the OpenAPI spec

---

For questions or improvements to this documentation system, please reach out to the development team.