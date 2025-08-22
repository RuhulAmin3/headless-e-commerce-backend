import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Prisma, Product, Variant } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { generateSlug } from "../category/category.utils";
import { IProductQuery } from "./product.interface";

// Create Product
const createProduct = async (
  payload: Omit<Product, "id" | "slug" | "createdAt" | "updatedAt"> & {
    variants: Omit<Variant, "id" | "productId" | "createdAt" | "updatedAt">[];
  },
) => {
  const slug = generateSlug(payload.name);

  // Check if product with same slug exists
  const existingProduct = await prisma.product.findUnique({
    where: { slug },
  });

  if (existingProduct) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product with this name/slug already exists",
    );
  }

  const isCategoryExists = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!isCategoryExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Category does not exist");
  }

  const product = await prisma.product.create({
    data: {
      ...payload,
      slug,
      variants: {
        createMany: {
          data: payload.variants,
        },
      },
    },
    include: {
      variants: true,
      category: true,
    },
  });

  return product;
};

const getAllProducts = async (
  query: IProductQuery,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, isFeatured, categoryId, variant, minPrice, maxPrice } =
    query || {};

  const andConditions: Prisma.ProductWhereInput[] = [];

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  // 🔎 Full-text search
  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { slug: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  //  Filter: isFeatured
  if (typeof isFeatured === "boolean") {
    andConditions.push({ isFeatured });
  }

  //  Filter: category
  if (categoryId) {
    andConditions.push({ categoryId });
  }

  // Filter: variant name
  if (variant) {
    andConditions.push({
      variants: {
        some: {
          name: { contains: variant, mode: "insensitive" },
        },
      },
    });
  }

  // Filter: price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: Prisma.VariantWhereInput = {};

    if (minPrice !== undefined) {
      priceFilter.price = { gte: minPrice };
    }

    if (maxPrice !== undefined) {
      priceFilter.price = {
        ...(typeof priceFilter.price === "object" && priceFilter.price !== null
          ? priceFilter.price
          : {}),
        lte: maxPrice,
      };
    }

    andConditions.push({
      variants: { some: priceFilter },
    });
  }

  const whereCondition: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Query products
  const products = await prisma.product.findMany({
    where: whereCondition,
    include: { category: true, variants: true },
    skip,
    take: limit,
    orderBy: sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() === "asc" ? "asc" : "desc" }
      : { createdAt: "desc" },
  });

  const total = await prisma.product.count({ where: whereCondition });

  const meta = {
    page,
    limit,
    total,
  };

  return { data: products, meta };
};

// Get Product by ID
const getProductById = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug: slug },
    include: { category: true, variants: true },
  });

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  return product;
};

// Update Product
const updateProduct = async (
  id: string,
  payload: Partial<Omit<Product, "id" | "slug" | "createdAt" | "updatedAt">>,
) => {
  // Check if product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  let slug = existingProduct.slug;

  // If name is updated, regenerate slug
  if (payload.name && payload.name !== existingProduct.name) {
    slug = generateSlug(payload.name);

    // Ensure slug is unique
    const slugExists = await prisma.product.findUnique({
      where: { slug },
    });

    if (slugExists && slugExists.id !== id) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Another product with this name already exists",
      );
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...payload,
      slug,
    },
  });

  return product;
};

// Delete Product
const deleteProduct = async (id: string) => {
  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  await prisma.$transaction(async (tsx) => {
    // Delete related variants first
    await tsx.variant.deleteMany({
      where: { productId: id },
    });

    await tsx.product.delete({
      where: { id },
    });
  });

  return null;
};

export const productServices = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
