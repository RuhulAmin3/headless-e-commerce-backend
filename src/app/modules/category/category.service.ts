import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Category, Prisma } from "@prisma/client";
import { generateSlug } from "./category.utils";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";

// Create Category
const createCategory = async (
  payload: Omit<Category, "id" | "slug" | "createdAt" | "updatedAt">,
) => {
  const slug = generateSlug(payload.name);

  // Check if category with same slug exists
  const existingCategory = await prisma.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Category with this name/slug already exists",
    );
  }

  const category = await prisma.category.create({
    data: {
      ...payload,
      slug,
    },
  });

  return category;
};

// Get All Categories
const getAllCategories = async (
  searchTerm: string,
  paginationOptions: IPaginationOptions,
) => {
  const andConditions: Prisma.CategoryWhereInput[] = [];

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { slug: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  const whereCondition: Prisma.CategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const categories = await prisma.category.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() === "asc" ? "asc" : "desc" }
      : { createdAt: "desc" },
  });

  const total = await prisma.category.count({ where: whereCondition });

  const meta = {
    page,
    limit,
    total,
  };

  return { data: categories, meta };
};

// Get Category by ID
const getCategoryById = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug: slug },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

// Update Category
const updateCategory = async (
  id: string,
  payload: Partial<Omit<Category, "id" | "slug" | "createdAt" | "updatedAt">>,
) => {
  // Check if category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  let slug = existingCategory.slug;

  // If name is updated, regenerate slug
  if (payload.name && payload.name !== existingCategory.name) {
    slug = generateSlug(payload.name);

    // Ensure slug is unique
    const slugExists = await prisma.category.findUnique({
      where: { slug },
    });

    if (slugExists && slugExists.id !== id) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Another category with this name already exists",
      );
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...payload,
      slug,
    },
  });

  return category;
};

// Delete Category
const deleteCategory = async (id: string) => {
  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: true }, // Check if category has products
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  if (category.products.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot delete category with existing products",
    );
  }

  const deletedCategory = await prisma.category.delete({
    where: { id },
  });

  return deletedCategory;
};

export const categoryServices = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
