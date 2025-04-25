import { z } from "zod";
import { JobType } from "@prisma/client";

const createJobZodSchema = z.object({
  title: z.string(),
  job_category_id: z.string(),
  deadline: z.string(),
  type: z.nativeEnum(JobType).default(JobType.FULL_TIME),
  level: z.string().optional(),
  salary: z.string(),
  qualifications: z.string(),
  requirements: z.string(),
  vacancy:z.number(),
  responsibilities: z.string(),
  shift: z.string().optional(),
});

const updateJobZodSchema = z.object({
  title: z.string().optional(),
  job_category_id: z.string().optional(),
  deadline: z.string().optional(),
  type: z.nativeEnum(JobType).optional(),
  level: z.string().optional(),
  salary: z.string().optional(),
  vacancy:z.number().optional(),
  qualifications: z.string().optional(),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  shift: z.string().optional(),
});

export const jobValidation = {
  createJobZodSchema,
  updateJobZodSchema,
};
