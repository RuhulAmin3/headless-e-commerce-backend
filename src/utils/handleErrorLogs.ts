import rTracer from "cls-rtracer";
import logger from "../shared/logger";
import { getGlobalData } from "./asyncLocalStorage";
import config from "../config";
import { ErrorResponse } from "../interfaces/errorLogTypes";

type ErrorLogsParams = {
  error: any;
  errorSource: string;
  additionalData?: any;
};

export const handleErrorLogs = async ({
  error,
  errorSource,
  additionalData,
}: ErrorLogsParams) => {
  const globalRequestData = getGlobalData();
  try {
    let postData: ErrorResponse = { 
      processInfo: `${config.node_env}:${config.port}`,
      errorSource,
      requestId: rTracer.id() as string,
      level: "error",
      code: error?.code || error?.name || null,
      content: additionalData || null,
      stackTrace: error?.stack || null,
      ip: globalRequestData?.ip || null,
      userAgent: globalRequestData?.userAgent || null,
    };

    if (error?.response) {
      postData = {
        ...postData,
        responseData:
          typeof error.response.data === "object"
            ? error.response.data
            : typeof error.response.data === "string"
              ? { message: error.response.data }
              : null,
        responseCode: error.response.status,
      };
    }

    // Replace all '\\' with right arrow symbol
    const logMessage = JSON.stringify(postData).replace(/\\\\/g, "→");
    logger.error(logMessage);
  } catch (err) {
    logger.error(err);
    if ((err as any).response) {
      logger.error(JSON.stringify((err as any).response.data));
    }
  }
};
