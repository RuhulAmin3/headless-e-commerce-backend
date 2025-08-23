import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { productController } from "./product.controller";
import { productValidation } from "./product.validation";

const router = express.Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product with variants
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *               - variants
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: "iPhone 15 Pro"
 *               description:
 *                 type: string
 *                 description: Product description (optional)
 *                 example: "Latest iPhone with advanced features"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs (optional)
 *                 example: ["https://example.com/iphone.jpg"]
 *               isFeatured:
 *                 type: boolean
 *                 description: Whether product is featured (optional)
 *                 example: true
 *               categoryId:
 *                 type: string
 *                 description: Category ID
 *                 example: "64f1b2b3b3b3b3b3b3b3b3b3"
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - price
 *                     - stock
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "128GB - Silver"
 *                     price:
 *                       type: number
 *                       example: 999.99
 *                     stock:
 *                       type: number
 *                       example: 50
 *                     isDefault:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  validateRequest(productValidation.createProductSchema),
  productController.createProduct,
);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with advanced filtering and pagination
 *     tags: [Product]
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of items per page
 *       - name: sortBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           default: "createdAt"
 *         description: Field to sort by
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "desc"
 *         description: Sort order
 *       - name: searchTerm
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term for product name or description
 *         example: "iphone"
 *       - name: isFeatured
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter by featured products
 *       - name: categoryId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *         example: "64f1b2b3b3b3b3b3b3b3b3b3"
 *       - name: variant
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by variant name
 *         example: "128GB"
 *       - name: minPrice
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *         example: 100
 *       - name: maxPrice
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *         example: 1000
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Products retrieved successfully!"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     summary: Get a product by slug
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug of the product to retrieve
 *     responses:
 *       200:
 *         description: The product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get("/:slug", productController.getProductBySlug);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product (variants updated separately)
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name (optional)
 *                 example: "iPhone 15 Pro Max"
 *               description:
 *                 type: string
 *                 description: Product description (optional)
 *                 example: "Updated product description"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs (optional)
 *                 example: ["https://example.com/new-image.jpg"]
 *               isFeatured:
 *                 type: boolean
 *                 description: Whether product is featured (optional)
 *                 example: false
 *               categoryId:
 *                 type: string
 *                 description: Category ID (optional)
 *                 example: "64f1b2b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/:id",
  validateRequest(productValidation.updateProductSchema),
  productController.updateProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to delete
 *     responses:
 *       200:
 *         description: The deleted product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.delete("/:id", productController.deleteProduct);

export const productRoutes = router;
