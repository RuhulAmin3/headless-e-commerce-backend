import { Prisma } from "@prisma/client";
import prisma from "./prisma";
import ApiError from "../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";

interface RecordExistOptions {
  where: Record<string, any>;
  select?: Record<string, boolean>;
  include?: Record<string, boolean>;
}

export const isRecordExist = async (
  modelName: Prisma.ModelName,
  options: RecordExistOptions,
  errorMessage?: string,
): Promise<unknown> => {
  const model = (prisma as any)[modelName];

  if (typeof model?.findUnique !== "function") {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid model: ${modelName}`);
  }

  const query: any = {
    where: options.where,
  };

  if (options.select) query.select = options.select;
  if (options.include) query.include = options.include;

  const record = await model.findUnique(query);

  if (!record) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      errorMessage || `${modelName} not found`,
    );
  }

  return record;
};
