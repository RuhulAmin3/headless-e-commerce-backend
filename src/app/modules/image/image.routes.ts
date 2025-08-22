import express from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { imageController } from "./image.controller";
import { imageValidation } from "./image.validation";

const router = express.Router();

// Create image route (POST)
router.post(
  "/",
  fileUploader.upload.single("file"),
  imageController.createImage
);

// Create image route (POST)
router.post(
  "/multiple",
  fileUploader.upload.array("files"),
  imageController.createMultipleImage
);

// Delete image by ID route (DELETE)
router.delete("/delete", imageController.deleteImage);

router.delete(
  "/bulk",
  validateRequest(imageValidation.deleteMultipleImagesSchema),
  imageController.deleteMultipleImages
);

export const imageRoutes = router;
