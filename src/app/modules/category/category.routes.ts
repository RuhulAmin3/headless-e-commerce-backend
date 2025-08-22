import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { categoryController } from "./category.controller";
import { categoryValidation } from "./category.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(categoryValidation.createCategorySchema),
  categoryController.createCategory,
);

router.get("/", categoryController.getAllCategories);

router.get("/:id", categoryController.getCategoryById);

router.patch(
  "/:id",
  validateRequest(categoryValidation.updateCategorySchema),
  categoryController.updateCategory,
);

router.delete("/:id", categoryController.deleteCategory);

export const categoryRoutes = router;
