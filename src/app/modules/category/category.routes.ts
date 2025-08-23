import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { categoryController } from "./category.controller";
import { categoryValidation } from "./category.validation";

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name (must be unique)
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 description: Optional category description
 *                 example: "Electronic devices and gadgets"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs
 *                 example: ["https://example.com/image1.jpg"]
 *     responses:
 *       201:
 *         description: Category created successfully
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
  validateRequest(categoryValidation.createCategorySchema),
  categoryController.createCategory,
);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories with pagination and search
 *     tags: [Category]
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
 *         description: Search term for category name or description
 *         example: "electronic"
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                   example: "Categories retrieved successfully!"
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
 *                     $ref: '#/components/schemas/Category'
 */
router.get("/", categoryController.getAllCategories);

/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     summary: Get a category by slug
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug of the category to retrieve
 *     responses:
 *       200:
 *         description: The category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.get("/:slug", categoryController.getCategoryBySlug);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update a category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name (optional)
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 description: Category description (optional)
 *                 example: "Electronic devices and gadgets"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs (optional)
 *                 example: ["https://example.com/image1.jpg"]
 *     responses:
 *       200:
 *         description: Category updated successfully
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
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/:id",
  validateRequest(categoryValidation.updateCategorySchema),
  categoryController.updateCategory,
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: The deleted category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.delete("/:id", categoryController.deleteCategory);

export const categoryRoutes = router;
