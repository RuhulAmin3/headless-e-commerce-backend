import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { variantController } from "./variant.controller";
import { variantValidation } from "./variant.validation";

const router = express.Router();

/**
 * @swagger
 * /variants:
 *   post:
 *     summary: Create a new variant for a product
 *     tags: [Variant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - productId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Variant name (e.g., size, color)
 *                 example: "256GB - Space Black"
 *               price:
 *                 type: number
 *                 description: Variant price
 *                 example: 1199.99
 *               stock:
 *                 type: number
 *                 description: Available stock quantity
 *                 example: 25
 *               isDefault:
 *                 type: boolean
 *                 description: Whether this is the default variant (optional)
 *                 example: false
 *               productId:
 *                 type: string
 *                 description: Product ID this variant belongs to
 *                 example: "64f1b2b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       201:
 *         description: Variant created successfully
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
  validateRequest(variantValidation.createVariantSchema),
  variantController.createVariant,
);

/**
 * @swagger
 * /variants:
 *   get:
 *     summary: Get all variants (typically filtered by productId)
 *     tags: [Variant]
 *     description: This endpoint returns variants, usually filtered by productId in the service layer
 *     responses:
 *       200:
 *         description: Variants retrieved successfully
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
 *                   example: "Variants retrieved successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Variant'
 */
router.get("/", variantController.getAllVariants);

/**
 * @swagger
 * /variants/{id}:
 *   get:
 *     summary: Get a variant by ID
 *     tags: [Variant]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the variant to retrieve
 *     responses:
 *       200:
 *         description: The variant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Variant'
 */
router.get("/:id", variantController.getVariantById);

/**
 * @swagger
 * /variants/{id}:
 *   patch:
 *     summary: Update a variant
 *     tags: [Variant]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the variant to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Variant name (optional)
 *                 example: "512GB - Space Black"
 *               price:
 *                 type: number
 *                 description: Variant price (optional)
 *                 example: 1399.99
 *               stock:
 *                 type: number
 *                 description: Available stock quantity (optional)
 *                 example: 15
 *               isDefault:
 *                 type: boolean
 *                 description: Whether this is the default variant (optional)
 *                 example: true
 *     responses:
 *       200:
 *         description: Variant updated successfully
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
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/:id",
  validateRequest(variantValidation.updateVariantSchema),
  variantController.updateVariant,
);

/**
 * @swagger
 * /variants/{id}:
 *   delete:
 *     summary: Delete a variant
 *     tags: [Variant]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the variant to delete
 *     responses:
 *       200:
 *         description: The deleted variant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Variant'
 */
router.delete("/:id", variantController.deleteVariant);

export const variantRoutes = router;
