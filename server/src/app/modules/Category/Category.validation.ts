import { z } from "zod";

// Validation for creating a new category
const createCategoryValidationSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title must be at most 100 characters long"),
});

// Validation for updating a category (partial, title optional)
const updateCategoryValidationSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title must be at most 100 characters long")
    .optional(),
});

export const categoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
