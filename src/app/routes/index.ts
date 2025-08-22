import express from "express";
import { imageRoutes } from "../modules/image/image.routes";

const router = express.Router();

import { categoryRoutes } from "../modules/category/category.routes";

const moduleRoutes = [
  {
    path: "/file",
    route: imageRoutes,
  },
  {
    path: "/categories",
    route: categoryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
