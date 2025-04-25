import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { categoryController } from "./Category.controller";
import { categoryValidation } from "./Category.validation";

const router = express.Router();

// Get all categories
router.get("/", auth(UserRole.SUPER_ADMIN, UserRole.USER), categoryController.getCategories);

// Get category by ID
router.get("/:id", auth(UserRole.SUPER_ADMIN, UserRole.USER), categoryController.getCategoryById);

// Create a new category
router.post(
    "/",
    auth(UserRole.SUPER_ADMIN, UserRole.USER),
    validateRequest(categoryValidation.createCategoryValidationSchema),
    categoryController.createCategory
);

// Update category
router.patch(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.USER),
    validateRequest(categoryValidation.updateCategoryValidationSchema),
    categoryController.updateCategory
);

// Delete category
router.delete(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.USER),
    categoryController.deleteCategory
);

export const categoryRoutes = router;