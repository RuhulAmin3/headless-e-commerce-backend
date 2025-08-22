import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Product, Variant } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { generateSlug } from "../category/category.utils";
import { IProductQuery, MongoAggregateResponse } from "./product.interface";
import { ObjectId } from "mongodb";

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
    query;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const match: any = {};

  // 🔎 Search
  if (searchTerm) {
    match.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { slug: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // 🎯 Filters
  if (typeof isFeatured === "boolean") {
    match.isFeatured = isFeatured;
  }

  if (categoryId) {
    match.categoryId = new ObjectId(categoryId);
  }

  const variantConditions: any[] = [];

  if (variant) {
    variantConditions.push({
      "variants.name": { $regex: variant, $options: "i" },
    });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceCond: any = {};
    if (minPrice !== undefined) priceCond.$gte = minPrice;
    if (maxPrice !== undefined) priceCond.$lte = maxPrice;

    variantConditions.push({ "variants.price": priceCond });
  }

  if (variantConditions.length > 0) {
    match.$and = match.$and
      ? [...match.$and, ...variantConditions]
      : variantConditions;
  }

  // 🛠 Aggregation pipeline
  const pipeline: any[] = [
    { $match: match },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "variants",
        localField: "_id",
        foreignField: "productId",
        as: "variants",
      },
    },
    {
      $sort: sortBy
        ? { [sortBy]: sortOrder?.toLowerCase() === "asc" ? 1 : -1 }
        : { createdAt: -1 },
    },
    { $skip: skip },
    { $limit: limit },
  ];

  const countPipeline: any[] = [{ $match: match }, { $count: "total" }];

  console.log("pipeLine", pipeline);

  // Execute aggregation with explicit type
  const productsResult = (await prisma.$runCommandRaw({
    aggregate: "products",
    pipeline,
    cursor: {},
  })) as unknown as MongoAggregateResponse;

  const countResult = (await prisma.$runCommandRaw({
    aggregate: "products",
    pipeline: countPipeline,
    cursor: {},
  })) as unknown as MongoAggregateResponse<{ total: number }>;

  const total = countResult?.cursor?.firstBatch?.[0]?.total ?? 0;

  const meta = { page, limit, total };

  console.log("pipeLine", pipeline);

  return { data: productsResult.cursor.firstBatch[0] ?? [], meta };
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
