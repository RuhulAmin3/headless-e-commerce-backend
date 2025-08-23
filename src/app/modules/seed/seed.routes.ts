import express from "express";
import { seedController } from "./seed.controller";

const router = express.Router();

/**
 * @swagger
 * /seed:
 *   post:
 *     summary: Seed the database with initial data
 *     tags: [Seed]
 *     responses:
 *       200:
 *         description: The database was seeded successfully
 */
router.post("/", seedController.seedDatabase);

export const seedRoutes = router;
