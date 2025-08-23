import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { cartServices } from "./cart.service";
import { getGlobalData } from "../../../utils/asyncLocalStorage";

const getCart = catchAsync(async (req: Request, res: Response) => {
  const token = getGlobalData()?.token as string;
  const result = await cartServices.getCart(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart retrieved successfully!",
    data: result,
  });
});

const addItemToCart = catchAsync(async (req: Request, res: Response) => {
  const token = getGlobalData()?.token as string;
  const result = await cartServices.addItemToCart(token, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item added to cart successfully!",
    data: result,
  });
});

const updateCartItemQuantity = catchAsync(
  async (req: Request, res: Response) => {
    const token = getGlobalData()?.token as string;
    const { variantId } = req.params;
    const { quantity } = req.body;
    const result = await cartServices.updateCartItemQuantity(
      token,
      variantId,
      quantity,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cart item quantity updated successfully!",
      data: result,
    });
  },
);

const removeCartItem = catchAsync(async (req: Request, res: Response) => {
  const token = getGlobalData()?.token as string;
  const { variantId } = req.params;
  const result = await cartServices.removeCartItem(token, variantId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart item removed successfully!",
    data: result,
  });
});

const applyPromoToCart = catchAsync(async (req: Request, res: Response) => {
  const token = getGlobalData()?.token as string;
  const { promoCode } = req.body;
  const result = await cartServices.applyPromoToCart(token, promoCode);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Promo applied to cart successfully!",
    data: result,
  });
});

const removePromoFromCart = catchAsync(async (req: Request, res: Response) => {
  const token = getGlobalData()?.token as string;
  const result = await cartServices.removePromoFromCart(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Promo removed from cart successfully!",
    data: result,
  });
});

const checkoutFromCart = catchAsync(async (req: Request, res: Response) => {
  const token = getGlobalData()?.token as string;
  const result = await cartServices.checkoutFromCart(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Checkout successfully!",
    data: result,
  });
});

export const cartController = {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  applyPromoToCart,
  removePromoFromCart,
  checkoutFromCart,
};
