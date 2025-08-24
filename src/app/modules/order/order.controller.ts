import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { orderServices } from "./order.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { getGlobalData } from "../../../utils/asyncLocalStorage";

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const query = pick(req.query, ["status", "searchTerm"]);

  const token = getGlobalData()?.token as string;

  query.token = token;

  const paginationOptions = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);

  const result = await orderServices.getAllOrders(query, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.getOrderById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.updateOrderStatus(
    req.params.id,
    req.body.newStatus,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.cancelOrder(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order cancelled successfully",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.deleteOrder(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order deleted successfully",
    data: result,
  });
});

const getOrderAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.getOrderAnalytics();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order analytics retrieved successfully",
    data: result,
  });
});

export const orderController = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrderAnalytics,
};
