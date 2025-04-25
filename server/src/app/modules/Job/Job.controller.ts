import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { jobFilterableFields } from "./Job.constant";
import { jobService } from "./Job.service";
import { IParams } from "./Job.interface";

// Get all jobs
const getJobs = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, jobFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await jobService.getJobsFromDb(
        filters as unknown as IParams,
        options
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Jobs retrieved successfully!",
        data: result,
    });
});

// Create job
const createJob = catchAsync(async (req: Request, res: Response) => {
    const result = await jobService.createJob(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Job created successfully!",
        data: result,
    });
});

// Get job by ID
const getJobById = catchAsync(async (req: Request, res: Response) => {
    const result = await jobService.getJobById(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Job retrieved successfully!",
        data: result,
    });
});

// Update job
const updateJob = catchAsync(async (req: Request, res: Response) => {
    const result = await jobService.updateJob(req.params.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Job updated successfully!",
        data: result,
    });
});

// Delete job
const deleteJob = catchAsync(async (req: Request, res: Response) => {
    await jobService.deleteJobById(req.params.id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Job deleted successfully!",
        data: null,
    });
});

export const jobController = {
    getJobs,
    createJob,
    getJobById,
    updateJob,
    deleteJob,
};
