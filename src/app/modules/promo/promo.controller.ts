import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { promoServices } from "./promo.service";
import pick from "../../../shared/pick";

const createPromo = catchAsync(async (req: Request, res: Response) => {
  const result = await promoServices.createPromo(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Promo created successfully!",
    data: result,
  });
});

const getAllPromos = catchAsync(async (req: Request, res: Response) => {
  const query = pick(req.query, ["searchTerm", "code"]) || {};

  const paginationOptions = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);

  const result = await promoServices.getAllPromos(
    query as { searchTerm: string; code: string },
    paginationOptions,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Promos retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getPromoById = catchAsync(async (req: Request, res: Response) => {
  const result = await promoServices.getPromoById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Promo retrieved successfully!",
    data: result,
  });
});

const updatePromo = catchAsync(async (req: Request, res: Response) => {
  const result = await promoServices.updatePromo(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Promo updated successfully!",
    data: result,
  });
});

const deletePromo = catchAsync(async (req: Request, res: Response) => {
  const result = await promoServices.deletePromo(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Promo deleted successfully!",
    data: result,
  });
});

const applyPromo = catchAsync(async (req: Request, res: Response) => {
  const { code, amount } = req.body;
  const result = await promoServices.applyPromo(code, amount);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Promo applied successfully!",
    data: result,
  });
});

export const promoController = {
  createPromo,
  getAllPromos,
  getPromoById,
  updatePromo,
  deletePromo,
  applyPromo,
};
