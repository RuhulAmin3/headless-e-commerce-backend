import * as z from "zod";

export const addItemToCartSchema = z.object({
  variantId: z.string({
    required_error: "Variant ID is required",
  }),
  quantity: z.number().int().positive({
    message: "Quantity must be a positive integer",
  }),
});

export const updateCartItemQuantitySchema = z.object({
  quantity: z.number({
    required_error: "quantity is required",
  }),
});

export const applyPromoToCartSchema = z.object({
  promoCode: z.string({
    required_error: "Promo code is required",
  }),
});

export const cartValidation = {
  addItemToCartSchema,
  updateCartItemQuantitySchema,
  applyPromoToCartSchema,
};
