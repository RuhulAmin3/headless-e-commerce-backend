import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { variantServices } from "./variant.service";
import pick from "../../../shared/pick";

const createVariant = catchAsync(async (req: Request, res: Response) => {
  const result = await variantServices.createVariant(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Variant created successfully!",
    data: result,
  });
});

const getAllVariants = catchAsync(async (req: Request, res: Response) => {
  const { productId } = pick(req.params, ["productId"]) as {
    productId: string;
  };

  const result = await variantServices.getAllVariants(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Variants retrieved successfully!",
    data: result,
  });
});

const getVariantById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await variantServices.getVariantById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Variant retrieved successfully!",
    data: result,
  });
});

const updateVariant = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const result = await variantServices.updateVariant(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Variant updated successfully!",
    data: result,
  });
});

const deleteVariant = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await variantServices.deleteVariant(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Variant deleted successfully!",
    data: result,
  });
});

export const variantController = {
  createVariant,
  getAllVariants,
  getVariantById,
  updateVariant,
  deleteVariant,
};
