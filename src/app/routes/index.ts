import express from "express";
import { imageRoutes } from "../modules/image/image.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/file",
    route: imageRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
