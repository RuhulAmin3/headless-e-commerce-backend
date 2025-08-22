// Image.controller: Module file for the Image.controller functionality.
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { imageServices } from "./image.service";

// Controller for creating an image
const createImage = catchAsync(async (req: Request, res: Response) => {
  const result = await imageServices.createImage(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image uploaded successfully!",
    data: result,
  });
});

// Controller for creating images
const createMultipleImage = catchAsync(async (req: Request, res: Response) => {
  const result = await imageServices.createImages(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Images uploaded  successfully!",
    data: result,
  });
});

// Controller for deleting an image
const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const result = await imageServices.deleteImage(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image removed successfully!",
    data: result,
  });
});

// Controller for deleting multiple images
const deleteMultipleImages = catchAsync(async (req: Request, res: Response) => {
  const { urls } = req.body;
  const result = await imageServices.deleteMultipleImages(urls);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Images removed successfully",
    data: result,
  });
});

export const imageController = {
  createImage,
  deleteImage,
  createMultipleImage,
  deleteMultipleImages,
};
