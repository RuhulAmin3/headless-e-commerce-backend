import * as z from "zod";

export const createVariantSchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number(),
  isDefault: z.boolean().optional(),
  productId: z.string(),
});

export const updateVariantSchema = z
  .object({
    name: z.string().optional(),
    price: z.number().optional(),
    stock: z.number().optional(),
    isDefault: z.boolean().optional(),
  })
  .strict();

export const variantValidation = {
  createVariantSchema,
  updateVariantSchema,
};
