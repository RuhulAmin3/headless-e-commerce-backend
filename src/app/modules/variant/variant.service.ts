import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Variant } from "@prisma/client";

const createVariant = async (payload: Variant) => {
  const isProductExist = await prisma.product.findUnique({
    where: {
      id: payload.productId,
    },
  });

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  const variant = await prisma.variant.create({
    data: payload,
  });
  return variant;
};

const getAllVariants = async (productId?: string) => {
  console.log("productId", productId);
  const variants = await prisma.variant.findMany({ where: { productId } });
  return variants;
};

const getVariantById = async (id: string) => {
  const variant = await prisma.variant.findUnique({
    where: {
      id,
    },
  });

  if (!variant) {
    throw new ApiError(httpStatus.NOT_FOUND, "Variant not found");
  }
  return variant;
};

const updateVariant = async (
  id: string,
  payload: Partial<Omit<Variant, "productId">>,
) => {
  const variant = await prisma.variant.update({
    where: {
      id,
    },
    data: payload,
  });

  return variant;
};

const deleteVariant = async (id: string) => {
  const variant = await prisma.variant.delete({
    where: {
      id,
    },
  });

  return variant;
};

export const variantServices = {
  createVariant,
  getAllVariants,
  getVariantById,
  updateVariant,
  deleteVariant,
};
