import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { productController } from "./product.controller";
import { productValidation } from "./product.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(productValidation.createProductSchema),
  productController.createProduct,
);

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.patch(
  "/:id",
  validateRequest(productValidation.updateProductSchema),
  productController.updateProduct,
);

router.delete("/:id", productController.deleteProduct);

export const productRoutes = router;
