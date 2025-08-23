import express from "express";
import { orderController } from "./order.controller";

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders with filtering and pagination
 *     tags: [Order]
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of items per page
 *       - name: sortBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           default: "createdAt"
 *         description: Field to sort by
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "desc"
 *         description: Sort order
 *       - name: status
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PENDING, PAID, SHIPPED, DELIVERED, CANCELLED]
 *         description: Filter by order status
 *         example: "PENDING"
 *       - name: searchTerm
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term for order number
 *         example: "ORD-"
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Orders retrieved successfully"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.get("/", orderController.getAllOrders);

/**
 * @swagger
 * /orders/analytics:
 *   get:
 *     summary: Get order analytics and statistics
 *     tags: [Order]
 *     description: Returns analytics data like total orders, revenue, status distribution, etc.
 *     responses:
 *       200:
 *         description: Order analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Order analytics retrieved successfully"
 *                 data:
 *                   type: object
 *                   description: Analytics data object
 *                   example:
 *                     totalOrders: 150
 *                     totalRevenue: 25000
 *                     statusBreakdown:
 *                       PENDING: 10
 *                       PAID: 50
 *                       SHIPPED: 40
 *                       DELIVERED: 45
 *                       CANCELLED: 5
 */
router.get("/analytics", orderController.getOrderAnalytics);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: The order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.get("/:id", orderController.getOrderById);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update the status of an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newStatus
 *             properties:
 *               newStatus:
 *                 type: string
 *                 enum: [PENDING, PAID, SHIPPED, DELIVERED, CANCELLED]
 *                 description: New status for the order
 *                 example: "SHIPPED"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request - invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/status", orderController.updateOrderStatus);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to cancel
 *     responses:
 *       200:
 *         description: The cancelled order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.patch("/:id/cancel", orderController.cancelOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to delete
 *     responses:
 *       200:
 *         description: The deleted order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.delete("/:id", orderController.deleteOrder);

export const orderRoutes = router;
