import express from "express";
import { imageController } from "./image.controller";
import { imageValidation } from "./image.validation";
import { fileUploader } from "../../../helpars/fileUploader";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// Upload single image
router.post(
  "/",
  fileUploader.upload.single("file"),
  imageController.createImage,
);

// Upload multiple images
router.post(
  "/multiple",
  fileUploader.upload.array("files", 10), // Max 10 files
  imageController.createImages,
);

// Delete single image
router.delete(
  "/delete",
  validateRequest(imageValidation.deleteImageSchema),
  imageController.deleteImage,
);

// Delete multiple images
router.delete(
  "/delete-multiple",
  validateRequest(imageValidation.deleteMultipleImagesSchema),
  imageController.deleteMultipleImages,
);

export const imageRoutes = router;
