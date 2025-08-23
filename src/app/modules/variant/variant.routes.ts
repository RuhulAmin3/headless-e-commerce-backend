import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { variantController } from "./variant.controller";
import { variantValidation } from "./variant.validation";

const router = express.Router();

/**
 * @swagger
 * /variants:
 *   post:
 *     summary: Create a new variant
 *     tags: [Variant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Variant'
 *     responses:
 *       201:
 *         description: The created variant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Variant'
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
 *     summary: Get all variants
 *     tags: [Variant]
 *     responses:
 *       200:
 *         description: A list of variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Variant'
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
 *             $ref: '#/components/schemas/Variant'
 *     responses:
 *       200:
 *         description: The updated variant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Variant'
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
