import { PrismaClient } from "@prisma/client";
import logger from "./logger";

const prisma = new PrismaClient();

async function connectPrisma() {
  try {
    await prisma.$connect();
    logger.info("Prisma connected to the database successfully!");
  } catch (error) {
    logger.error("Prisma connection failed:", error);
    process.exit(1);
  }

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    logger.info("Prisma disconnected due to application termination.");
    process.exit(0);
  });
}

connectPrisma();

export default prisma;
