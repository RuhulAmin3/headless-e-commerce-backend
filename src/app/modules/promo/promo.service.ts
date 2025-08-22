import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Prisma, Promo, PromoStatus, PromoType } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";

const createPromo = async (payload: Promo) => {
  const promo = await prisma.promo.create({
    data: payload,
  });
  return promo;
};

const getAllPromos = async (
  query: { searchTerm?: string; code?: string },
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, code } = query;
  const andConditions: Prisma.PromoWhereInput[] = [];

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  if (searchTerm) {
    andConditions.push({
      OR: [{ code: { contains: searchTerm, mode: "insensitive" } }],
    });
  }

  if (code) {
    andConditions.push({
      code: { equals: code },
    });
  }

  const whereCondition: Prisma.PromoWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const promos = await prisma.promo.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() === "asc" ? "asc" : "desc" }
      : { createdAt: "desc" },
  });

  const total = await prisma.promo.count({ where: whereCondition });

  const meta = {
    page,
    limit,
    total,
  };

  return { data: promos, meta };
};

const getPromoById = async (id: string) => {
  const promo = await prisma.promo.findUnique({
    where: {
      id,
    },
  });
  if (!promo) {
    throw new ApiError(httpStatus.NOT_FOUND, "Promo not found");
  }
  return promo;
};

const updatePromo = async (id: string, payload: Partial<Promo>) => {
  const promo = await prisma.promo.update({
    where: {
      id,
    },
    data: payload,
  });

  return promo;
};

const deletePromo = async (id: string) => {
  const promo = await prisma.promo.delete({
    where: {
      id,
    },
  });
  return promo;
};

const applyPromo = async (code: string, amount: number) => {
  const promo = await prisma.promo.findUnique({
    where: { code },
  });

  if (!promo) {
    throw new ApiError(httpStatus.NOT_FOUND, "Promo not found");
  }

  if (promo.status !== PromoStatus.ACTIVE) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Promo is not active");
  }

  const now = new Date();
  if (now < promo.validFrom || now > promo.validTo) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Promo is not valid yet or has expired",
    );
  }

  if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Promo usage limit reached");
  }

  if (promo.minimumAmount && amount < promo.minimumAmount) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Minimum amount of ${promo.minimumAmount} required for this promo`,
    );
  }

  if (promo.uptoDiscount && amount > promo.uptoDiscount) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Maximum amount of ${promo.uptoDiscount} for this promo`,
    );
  }

  let discount = 0;

  if (promo.type === PromoType.PERCENT) {
    discount = (amount * promo.value) / 100;
  } else if (promo.type === PromoType.FIXED) {
    discount = promo.value;
  }

  // Increment usage count
  await prisma.promo.update({
    where: { id: promo.id },
    data: { usageCount: { increment: 1 } },
  });

  return { discount, promoId: promo.id };
};

export const promoServices = {
  createPromo,
  getAllPromos,
  getPromoById,
  updatePromo,
  deletePromo,
  applyPromo,
};
