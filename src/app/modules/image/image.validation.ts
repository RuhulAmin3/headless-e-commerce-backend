// src/modules/image/image.validation.ts
import { z } from "zod";

const deleteImageSchema = z.object({
  url: z
    .string({
      required_error: "Image URL is required",
    })
    .url("Invalid image URL"),
});

const deleteMultipleImagesSchema = z.object({
  urls: z
    .array(
      z
        .string({
          required_error: "Image URL is required",
        })
        .url("Invalid image URL"),
    )
    .min(1, "At least one image URL is required"),
});

export const imageValidation = {
  deleteImageSchema,
  deleteMultipleImagesSchema,
};
