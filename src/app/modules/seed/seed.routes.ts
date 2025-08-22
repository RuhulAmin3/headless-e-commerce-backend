import express from "express";
import { seedController } from "./seed.controller";

const router = express.Router();

router.post("/", seedController.seedDatabase);

export const seedRoutes = router;
