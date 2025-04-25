import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, Job } from "@prisma/client";
import httpStatus from "http-status";
import { IParams } from "./Job.interface";

// Retrieve all jobs with filtering, searching, and pagination
const getJobsFromDb = async (params: IParams, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.JobWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: ["title", "level"].map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.JobWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.job.findMany({
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
        include: {
            job_category: true,
        },
    });

    const total = await prisma.job.count({
        where: whereConditions,
    });

    if (!result || result.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No job listings found");
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

// Create a job
const createJob = async (payload: Job) => {

    const isCategoryExist = await prisma.category.findUnique({
        where:{id:payload.job_category_id}
    })

    if(!isCategoryExist) throw new ApiError(httpStatus.BAD_REQUEST,"category doesn't exist")

    const result = await prisma.job.create({
        data: payload,
    });

    return result;
};

// Get job by ID
const getJobById = async (id: string): Promise<Job> => {
    const job = await prisma.job.findUnique({
        where: { id },
        include: { job_category: true },
    });

    if (!job) {
        throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
    }

    return job;
};

// Update a job
const updateJob = async (id: string, payload: Partial<Job>) => {
    const existing = await prisma.job.findUnique({ where: { id } });

    if (!existing) {
        throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
    }

    const result = await prisma.job.update({
        where: { id },
        data: payload,
    });

    return result;
};

// Delete a job
const deleteJobById = async (id: string) => {

    const existing = await prisma.job.findUnique({ where: { id } });

    if (!existing) {
        throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
    }

    await prisma.job.delete({ where: { id } });

};

export const jobService = {
    getJobsFromDb,
    createJob,
    getJobById,
    updateJob,
    deleteJobById,
};
