import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { jobValidation } from "./Job.validation";
import { jobController } from "./Job.controller";

const router = express.Router();

// Create job
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(jobValidation.createJobZodSchema),
  jobController.createJob
);

// Get all jobs
router.get("/", jobController.getJobs);

// Get job by ID
router.get("/:id", jobController.getJobById);

// Update job
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(jobValidation.updateJobZodSchema),
  jobController.updateJob
);

// Delete job
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  jobController.deleteJob
);

export const jobRoutes = router;
