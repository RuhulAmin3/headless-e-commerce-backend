import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { cartController } from "./cart.controller";
import { cartValidation } from "./cart.validation";

const router = express.Router();

router.get("/", cartController.getCart);

router.post(
  "/",
  validateRequest(cartValidation.addItemToCartSchema),
  cartController.addItemToCart,
);

router.patch(
  "/update-quantity/:variantId",
  validateRequest(cartValidation.updateCartItemQuantitySchema),
  cartController.updateCartItemQuantity,
);

router.delete("/remove/:variantId", cartController.removeCartItem);

router.post(
  "/apply-promo",
  validateRequest(cartValidation.applyPromoToCartSchema),
  cartController.applyPromoToCart,
);

router.delete("/remove-promo", cartController.removePromoFromCart);

export const cartRoutes = router;
