/**
 * Simple validation script to test Swagger spec generation
 * Run with: node scripts/validate-swagger.js
 */

import swaggerJsdoc from  'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Headless E-commerce Backend API',
      version: '1.0.0',
      description: 'API documentation for the Headless E-commerce Backend',
    },
  },
  apis: [
    './src/app/modules/**/*.routes.ts',
    './src/config/swagger.definitions.ts',
  ],
};

try {
  const swaggerSpec = swaggerJsdoc(options);
  
  // Write the generated spec to a file for inspection
  const outputPath = path.join(path.dirname, '../swagger-spec.json');
  fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
  
  console.log('✅ Swagger spec generated successfully!');
  console.log(`📄 Spec written to: ${outputPath}`);
  console.log(`🔗 Endpoints found: ${Object.keys(swaggerSpec.paths || {}).length}`);
  console.log(`📋 Schemas defined: ${Object.keys(swaggerSpec.components?.schemas || {}).length}`);
} catch (error) {
  console.error('❌ Error generating Swagger spec:', error.message);
  process.exit(1);
}
