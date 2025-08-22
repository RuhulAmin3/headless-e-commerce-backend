import * as z from "zod";
import { PromoStatus, PromoType } from "@prisma/client";

export const createPromoSchema = z.object({
  code: z.string({
    required_error: "Promo code is required",
  }),
  type: z.nativeEnum(PromoType, {
    required_error: "Promo type is required",
  }),
  value: z.number({
    required_error: "Promo value is required",
  }),
  usageLimit: z.number().optional(),
  minimumAmount: z.number().optional(),
  uptoDiscount: z.number().optional(),
  validFrom: z.string().datetime({
    message: "Valid from date must be a valid datetime string",
  }),
  validTo: z.string().datetime({
    message: "Valid to date must be a valid datetime string",
  }),
});

export const updatePromoSchema = z
  .object({
    code: z.string().optional(),
    type: z.nativeEnum(PromoType).optional(),
    value: z.number().optional(),
    usageLimit: z.number().optional(),
    minimumAmount: z.number().optional(),
    uptoDiscount: z.number().optional(),
    status: z.nativeEnum(PromoStatus).optional(),
    validFrom: z.string().datetime().optional(),
    validTo: z.string().datetime().optional(),
  })
  .strict();

export const promoValidation = {
  createPromoSchema,
  updatePromoSchema,
};
