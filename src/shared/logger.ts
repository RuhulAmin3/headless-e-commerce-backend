import appRoot from "app-root-path";
import { createLogger, format, Logger, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, errors, splat, json } = format;

const logger: Logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    splat(),
    json(),
  ),

  defaultMeta: { service: "headless-e-commerce" },

  transports: [
    new transports.DailyRotateFile({
      filename: `${appRoot}/logs/error-%DATE%.log`,
      level: "error",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
    }),

    new transports.DailyRotateFile({
      filename: `${appRoot}/logs/combined-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

// Optional graceful shutdown ()
process.on("beforeExit", () => {
  for (const transport of logger.transports) {
    if (typeof transport.close === "function") {
      transport.close();
    }
  }
});

export const stream = {
  write: (message: string) => logger.http(message.trim()),
};

export default logger;
