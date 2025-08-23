import express from "express";
import { imageController } from "./image.controller";
import { imageValidation } from "./image.validation";
import { fileUploader } from "../../../helpars/fileUploader";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload a single image
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The uploaded image URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 */
router.post(
  "/",
  fileUploader.upload.single("file"),
  imageController.createImage,
);

/**
 * @swagger
 * /file/multiple:
 *   post:
 *     summary: Upload multiple images
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: The uploaded image URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post(
  "/multiple",
  fileUploader.upload.array("files", 10), // Max 10 files
  imageController.createImages,
);

/**
 * @swagger
 * /file/delete:
 *   delete:
 *     summary: Delete a single image
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: URL of the image to delete
 *                 example: "https://example.com/images/product.jpg"
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request - invalid URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  "/delete",
  validateRequest(imageValidation.deleteImageSchema),
  imageController.deleteImage,
);

/**
 * @swagger
 * /file/delete-multiple:
 *   delete:
 *     summary: Delete multiple images
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - urls
 *             properties:
 *               urls:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                   format: uri
 *                 description: Array of image URLs to delete
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *     responses:
 *       200:
 *         description: Images deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request - invalid URLs or empty array
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  "/delete-multiple",
  validateRequest(imageValidation.deleteMultipleImagesSchema),
  imageController.deleteMultipleImages,
);

export const imageRoutes = router;
