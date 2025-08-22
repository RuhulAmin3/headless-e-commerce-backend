import rTracer from "cls-rtracer";
import type { RequestHandler } from "express";
import { asyncLocalStorage } from "../../utils/asyncLocalStorage";
import { GlobalRequestData } from "../../interfaces/globalRequestData";

export const globalDataMiddleware: RequestHandler = (req, _res, next) => {
  const headers = req.headers;
  const token = headers["x-cart-token"] as string;

  const globalRequestInfo: GlobalRequestData = {
    token,
    ip: req.ip ?? "",
    requestId: rTracer.id() as string,
    userAgent: req.headers["user-agent"] as string,
  };

  asyncLocalStorage.run(globalRequestInfo, () => {
    next();
  });
};
