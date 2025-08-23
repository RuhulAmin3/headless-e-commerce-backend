import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { promoController } from "./promo.controller";
import { promoValidation } from "./promo.validation";

const router = express.Router();

/**
 * @swagger
 * /promos:
 *   post:
 *     summary: Create a new promo
 *     tags: [Promo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePromoRequest'
 *     responses:
 *       201:
 *         description: The created promo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
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
 *     summary: Get all promos
 *     tags: [Promo]
 *     responses:
 *       200:
 *         description: A list of promos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Promo'
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
 *     summary: Update a promo
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
 *             $ref: '#/components/schemas/UpdatePromoRequest'
 *     responses:
 *       200:
 *         description: The updated promo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
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
 *     summary: Apply a promo code
 *     tags: [Promo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: The result of applying the promo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 discount:
 *                   type: number
 *                 promoId:
 *                   type: string
 */
router.post("/apply", promoController.applyPromo);

export const promoRoutes = router;
