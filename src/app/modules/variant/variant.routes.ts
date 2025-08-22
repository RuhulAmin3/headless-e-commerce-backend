import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { variantController } from "./variant.controller";
import { variantValidation } from "./variant.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(variantValidation.createVariantSchema),
  variantController.createVariant,
);

router.get("/", variantController.getAllVariants);

router.get("/:id", variantController.getVariantById);

router.patch(
  "/:id",
  validateRequest(variantValidation.updateVariantSchema),
  variantController.updateVariant,
);

router.delete("/:id", variantController.deleteVariant);

export const variantRoutes = router;
