import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { promoController } from "./promo.controller";
import { promoValidation } from "./promo.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(promoValidation.createPromoSchema),
  promoController.createPromo,
);

router.get("/", promoController.getAllPromos);

router.get("/:id", promoController.getPromoById);

router.patch(
  "/:id",
  validateRequest(promoValidation.updatePromoSchema),
  promoController.updatePromo,
);

router.delete("/:id", promoController.deletePromo);

router.post("/apply", promoController.applyPromo);

export const promoRoutes = router;
