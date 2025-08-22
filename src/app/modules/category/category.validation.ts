import * as z from "zod";

export const createCategorySchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const updateCategorySchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
  })
  .strict();

export const categoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
