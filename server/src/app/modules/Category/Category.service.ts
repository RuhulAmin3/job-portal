import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import httpStatus from "http-status";
import { Category, Prisma } from "@prisma/client";  

const createCategory = async (payload: Category) => {
    const normalizedTitle = payload.title.trim().toLowerCase();
    // Check if a category with the same title already exists
    const isExist = await prisma.category.findFirst({
      where: {
        title: {
          equals: normalizedTitle,
          mode: "insensitive", 
        },
      },
    });
  
    if (isExist) {
      throw new ApiError(httpStatus.CONFLICT, "Category with this title already exists");
    }
  
    // Create new category
    const result = await prisma.category.create({
      data: {
        title: payload.title.trim(),
      },
    });
  
    return result;
  };

// Retrieve all categories with pagination and filtering
const getCategoriesFromDb = async (params: {searchTerm:string}, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm } = params;

  const andConditions: Prisma.CategoryWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["title"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const whereConditions: Prisma.CategoryWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.category.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOrder
      ? {
          [options.sortBy]: options.sortOrder,
        }
      : {
          createdAt: "desc",
        },
  });

  const total = await prisma.category.count({
    where: whereConditions,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No categories found");
  }

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get single category by ID
const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Category not found");
  }

  return category;
};

// Update category
const updateCategory = async (id: string, payload: Partial<Prisma.CategoryUpdateInput>) => {
  const exists = await prisma.category.findUnique({
    where: { id },
  });

  if (!exists) {
    throw new ApiError(404, "Category not found");
  }

  const result = await prisma.category.update({
    where: { id },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update category");
  }

  return result;
};

// Get single category by ID
const deleteCategoryById = async (id: string) => {
    const category = await prisma.category.findUnique({
      where: { id },
    });
  
    if (!category) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Category not found");
    }
     await prisma.category.delete({where:{id}}) 
  };

export const categoryService = {
  createCategory,
  getCategoriesFromDb,
  getCategoryById,
  updateCategory,
  deleteCategoryById
};
