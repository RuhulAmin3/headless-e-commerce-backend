import express from "express";
import { imageRoutes } from "../modules/image/image.routes";

const router = express.Router();

import { categoryRoutes } from "../modules/category/category.routes";

import { productRoutes } from "../modules/product/product.routes";

import { seedRoutes } from "../modules/seed/seed.routes";

import { variantRoutes } from "../modules/variant/variant.routes";

import { promoRoutes } from "../modules/promo/promo.routes";

import { cartRoutes } from "../modules/cart/cart.routes";

import { orderRoutes } from "../modules/order/order.routes";

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
  {
    path: "/variants",
    route: variantRoutes,
  },
  {
    path: "/promos",
    route: promoRoutes,
  },
  {
    path: "/cart",
    route: cartRoutes,
  },
  {
    path: "/orders",
    route: orderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
