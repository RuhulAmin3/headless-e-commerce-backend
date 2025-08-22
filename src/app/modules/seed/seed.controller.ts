import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { seedData } from "./seed";

const seedDatabase = catchAsync(async (req: Request, res: Response) => {
  await seedData();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Database seeded successfully!",
    data: null,
  });
});

export const seedController = {
  seedDatabase,
};
