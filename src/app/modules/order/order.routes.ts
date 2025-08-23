import express from "express";
import { orderController } from "./order.controller";

const router = express.Router();

router.get("/", orderController.getAllOrders);

router.get("/analytics", orderController.getOrderAnalytics);

router.get("/:id", orderController.getOrderById);

router.patch("/:id/status", orderController.updateOrderStatus);

router.patch("/:id/cancel", orderController.cancelOrder);

router.delete("/:id", orderController.deleteOrder);

export const orderRoutes = router;
