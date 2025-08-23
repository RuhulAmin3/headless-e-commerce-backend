import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { cartController } from "./cart.controller";
import { cartValidation } from "./cart.validation";

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the cart for the current session
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: The cart for the current session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.get("/", cartController.getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: The updated cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.post(
  "/",
  validateRequest(cartValidation.addItemToCartSchema),
  cartController.addItemToCart,
);

/**
 * @swagger
 * /cart/update-quantity/{variantId}:
 *   patch:
 *     summary: Update the quantity of an item in the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: variantId
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
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: The updated cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.patch(
  "/update-quantity/:variantId",
  validateRequest(cartValidation.updateCartItemQuantitySchema),
  cartController.updateCartItemQuantity,
);

/**
 * @swagger
 * /cart/remove/{variantId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the variant to remove
 *     responses:
 *       200:
 *         description: The updated cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.delete("/remove/:variantId", cartController.removeCartItem);

/**
 * @swagger
 * /cart/apply-promo:
 *   post:
 *     summary: Apply a promo code to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promoCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.post(
  "/apply-promo",
  validateRequest(cartValidation.applyPromoToCartSchema),
  cartController.applyPromoToCart,
);

/**
 * @swagger
 * /cart/remove-promo:
 *   delete:
 *     summary: Remove a promo code from the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: The updated cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.delete("/remove-promo", cartController.removePromoFromCart);

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Checkout the cart and create an order
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: The created order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post("/checkout", cartController.checkoutFromCart);

export const cartRoutes = router;
