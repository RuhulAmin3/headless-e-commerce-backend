import type { StatusCodes } from "http-status-codes";

export type ErrorResponse = {
  requestId: string;
  processInfo: string;
  errorSource: string;
  level: "error" | "warn" | "info";
  responseData?: any;
  responseCode?: StatusCodes;
  code: string;
  content: any;
  stackTrace: string | null;
  ip: string | null;
  userAgent: string | null;
};
