import express from "express";
import { seedController } from "./seed.controller";

const router = express.Router();

/**
 * @swagger
 * /seed:
 *   post:
 *     summary: Seed the database with initial data
 *     description: Be cautious!! This will delete all data and then seed a few demo records for testing purposes.
 *     tags: [Seed]
 *     responses:
 *       200:
 *         description: The database was seeded successfully
 */
router.post("/", seedController.seedDatabase);

export const seedRoutes = router;
