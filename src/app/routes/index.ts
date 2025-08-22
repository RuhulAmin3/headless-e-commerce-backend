import express from "express";
import { imageRoutes } from "../modules/image/image.routes";

const router = express.Router();

import { categoryRoutes } from "../modules/category/category.routes";

import { productRoutes } from "../modules/product/product.routes";

import { seedRoutes } from "../modules/seed/seed.routes";

const moduleRoutes = [
  {
    path: "/file",
    route: imageRoutes,
  },
  {
    path: "/categories",
    route: categoryRoutes,
  },
  {
    path: "/products",
    route: productRoutes,
  },
  {
    path: "/seed",
    route: seedRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
