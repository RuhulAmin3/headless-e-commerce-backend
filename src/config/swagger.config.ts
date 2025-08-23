import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Headless E-commerce Backend API",
      version: "1.0.0",
      description: "API documentation for the Headless E-commerce Backend",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-cart-token",
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
