import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { promoController } from "./promo.controller";
import { promoValidation } from "./promo.validation";

const router = express.Router();

/**
 * @swagger
 * /promos:
 *   post:
 *     summary: Create a new promo code
 *     tags: [Promo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - type
 *               - value
 *               - validFrom
 *               - validTo
 *             properties:
 *               code:
 *                 type: string
 *                 description: Unique promo code
 *                 example: "SAVE20"
 *               type:
 *                 type: string
 *                 enum: [PERCENT, FIXED]
 *                 description: Promo type - PERCENT for percentage discount, FIXED for fixed amount
 *                 example: "PERCENT"
 *               value:
 *                 type: number
 *                 description: Discount value (percentage or fixed amount)
 *                 example: 20
 *               usageLimit:
 *                 type: number
 *                 description: Maximum number of times this promo can be used (optional)
 *                 example: 100
 *               minimumAmount:
 *                 type: number
 *                 description: Minimum cart amount required (optional)
 *                 example: 50
 *               uptoDiscount:
 *                 type: number
 *                 description: Maximum discount amount for percentage type (optional)
 *                 example: 100
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *                 description: Promo valid from date
 *                 example: "2024-01-01T00:00:00Z"
 *               validTo:
 *                 type: string
 *                 format: date-time
 *                 description: Promo valid until date
 *                 example: "2024-12-31T23:59:59Z"
 *     responses:
 *       201:
 *         description: Promo created successfully
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
  validateRequest(promoValidation.createPromoSchema),
  promoController.createPromo,
);

/**
 * @swagger
 * /promos:
 *   get:
 *     summary: Get all promos with search and pagination
 *     tags: [Promo]
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
 *         description: Search term for promo code
 *         example: "SAVE"
 *       - name: code
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Specific promo code to search for
 *         example: "SAVE20"
 *     responses:
 *       200:
 *         description: Promos retrieved successfully
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
 *                   example: "Promos retrieved successfully!"
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
 *                     $ref: '#/components/schemas/Promo'
 */
router.get("/", promoController.getAllPromos);

/**
 * @swagger
 * /promos/{id}:
 *   get:
 *     summary: Get a promo by ID
 *     tags: [Promo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the promo to retrieve
 *     responses:
 *       200:
 *         description: The promo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
 */
router.get("/:id", promoController.getPromoById);

/**
 * @swagger
 * /promos/{id}:
 *   patch:
 *     summary: Update a promo code
 *     tags: [Promo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the promo to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Promo code (optional)
 *                 example: "NEWSAVE20"
 *               type:
 *                 type: string
 *                 enum: [PERCENT, FIXED]
 *                 description: Promo type (optional)
 *                 example: "PERCENT"
 *               value:
 *                 type: number
 *                 description: Discount value (optional)
 *                 example: 25
 *               usageLimit:
 *                 type: number
 *                 description: Usage limit (optional)
 *                 example: 200
 *               minimumAmount:
 *                 type: number
 *                 description: Minimum cart amount (optional)
 *                 example: 75
 *               uptoDiscount:
 *                 type: number
 *                 description: Maximum discount amount (optional)
 *                 example: 150
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, EXPIRED]
 *                 description: Promo status (optional)
 *                 example: "ACTIVE"
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *                 description: Valid from date (optional)
 *                 example: "2024-01-01T00:00:00Z"
 *               validTo:
 *                 type: string
 *                 format: date-time
 *                 description: Valid until date (optional)
 *                 example: "2024-12-31T23:59:59Z"
 *     responses:
 *       200:
 *         description: Promo updated successfully
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
 *         description: Promo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/:id",
  validateRequest(promoValidation.updatePromoSchema),
  promoController.updatePromo,
);

/**
 * @swagger
 * /promos/{id}:
 *   delete:
 *     summary: Delete a promo
 *     tags: [Promo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the promo to delete
 *     responses:
 *       200:
 *         description: The deleted promo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
 */
router.delete("/:id", promoController.deletePromo);

/**
 * @swagger
 * /promos/apply:
 *   post:
 *     summary: Test applying a promo code to calculate discount
 *     tags: [Promo]
 *     description: This endpoint calculates the discount for a given promo code and amount without actually applying it to a cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - amount
 *             properties:
 *               code:
 *                 type: string
 *                 description: Promo code to test
 *                 example: "SAVE20"
 *               amount:
 *                 type: number
 *                 description: Cart amount to calculate discount for
 *                 example: 100
 *     responses:
 *       200:
 *         description: Discount calculated successfully
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
 *                   example: "Promo applied successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     discount:
 *                       type: number
 *                       description: Calculated discount amount
 *                       example: 20
 *                     promoId:
 *                       type: string
 *                       description: ID of the applied promo
 *                       example: "64f1b2b3b3b3b3b3b3b3b3b3"
 *       400:
 *         description: Invalid promo code or amount
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/apply", promoController.applyPromo);

export const promoRoutes = router;
