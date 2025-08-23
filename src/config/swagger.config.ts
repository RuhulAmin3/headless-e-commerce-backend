import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Headless E-commerce Backend API",
      version: "1.0.0",
      description:
        "API documentation for the Headless E-commerce Backend. This specification is auto-generated from JSDoc annotations in route files.",
      contact: {
        name: "Headless E-commerce Team",
        email: "support@example.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
    ],
    tags: [
      { name: "Image", description: "Image upload and deletion operations" },
      { name: "Category", description: "Product categories management" },
      { name: "Product", description: "Product catalog operations" },
      { name: "Variant", description: "Product variants (size, color, etc.)" },
      { name: "Promo", description: "Promotional codes and discounts" },
      { name: "Cart", description: "Shopping cart operations" },
      { name: "Order", description: "Order management and analytics" },
      { name: "Seed", description: "Database seeding for development" },
    ],

    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-cart-token",
        },
      },
      parameters: {
        PageParam: {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "integer", minimum: 1, default: 1 },
          description: "Page number for pagination",
        },
        LimitParam: {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          description: "Number of items per page",
        },
        SortByParam: {
          name: "sortBy",
          in: "query",
          required: false,
          schema: { type: "string" },
          description: "Field to sort by",
        },
        SortOrderParam: {
          name: "sortOrder",
          in: "query",
          required: false,
          schema: { type: "string", enum: ["asc", "desc"], default: "asc" },
          description: "Sort order",
        },
        SearchTermParam: {
          name: "searchTerm",
          in: "query",
          required: false,
          schema: { type: "string" },
          description: "Text search term",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: [
    "./src/app/modules/**/*.routes.ts",
    "./src/config/swagger.definitions.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
