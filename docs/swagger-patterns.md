# Swagger Documentation Quick Reference

## Common Patterns

### Basic GET Endpoint

```typescript
/**
 * @swagger
 * /endpoint:
 *   get:
 *     summary: Get all items
 *     tags: [YourModule]
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/YourSchema'
 */
```

### POST with Body

```typescript
/**
 * @swagger
 * /endpoint:
 *   post:
 *     summary: Create new item
 *     tags: [YourModule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRequest'
 *     responses:
 *       201:
 *         description: Created item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 */
```

### Path Parameters

```typescript
/**
 * @swagger
 * /endpoint/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [YourModule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 */
```

### Query Parameters with Pagination

```typescript
/**
 * @swagger
 * /endpoint:
 *   get:
 *     summary: Get paginated items
 *     tags: [YourModule]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchTermParam'
 */
```

### File Upload

```typescript
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 */
```

### Error Responses

```typescript
/**
 * @swagger
 * responses:
 *   400:
 *     description: Bad request
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ErrorResponse'
 *   404:
 *     description: Not found
 *   500:
 *     description: Internal server error
 */
```

## Schema Examples

### Basic Object

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           example: "60f1b2b3b3b3b3b3b3b3b3b3"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 */
```

### Array Property

```typescript
/**
 * tags:
 *   type: array
 *   items:
 *     type: string
 *   example: ["electronics", "mobile"]
 */
```

### Nested Object

```typescript
/**
 * address:
 *   type: object
 *   properties:
 *     street:
 *       type: string
 *     city:
 *       type: string
 */
```

### Enum Values

```typescript
/**
 * status:
 *   type: string
 *   enum: [active, inactive, pending]
 *   example: "active"
 */
```

### Date/Time Fields

```typescript
/**
 * createdAt:
 *   type: string
 *   format: date-time
 *   example: "2023-01-01T00:00:00Z"
 */
```
