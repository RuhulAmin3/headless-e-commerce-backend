import * as z from "zod";

export const createVariantSchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number(),
  isDefault: z.boolean().optional(),
});

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.string(),
  variants: z.array(createVariantSchema),
});

export const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.string().optional(),
  variants: z.array(createVariantSchema).optional(),
});

export const productValidation = {
  createProductSchema,
  updateProductSchema,
};
