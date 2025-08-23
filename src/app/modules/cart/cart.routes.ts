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
 *             type: object
 *             required:
 *               - variantId
 *               - quantity
 *             properties:
 *               variantId:
 *                 type: string
 *                 description: Variant ID to add to cart
 *                 example: "64f1b2b3b3b3b3b3b3b3b3b3"
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 description: Quantity (must be positive integer)
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart successfully
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
 *         example: "64f1b2b3b3b3b3b3b3b3b3b3"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: New quantity for the cart item
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item quantity updated successfully
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
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *             required:
 *               - promoCode
 *             properties:
 *               promoCode:
 *                 type: string
 *                 description: Promo code to apply
 *                 example: "SAVE20"
 *     responses:
 *       200:
 *         description: Promo code applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid promo code or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
