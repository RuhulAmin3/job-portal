import { UserRole } from "@prisma/client";
import { z } from "zod";

const registerUserValidationSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
});

const loginUserValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const changePasswordValidationSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const authValidation = {
  changePasswordValidationSchema,
  registerUserValidationSchema,
  loginUserValidationSchema,
};
