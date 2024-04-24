import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";

dotenv.config();

import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import expressSession from "express-session";
import prisma from "./db/prisma";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import adminRouter from "./routes/admin.routes";
import approvalRouter from "./routes/approval.routes";
import authRouter from "./routes/auth.routes";
import cancelRouter from "./routes/cancellation.routes";
import dashboardRouter from "./routes/dashboard.routes";
import facilityRouter from "./routes/facility.routes";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000;
export const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "OPTIONS", "PATCH", "DELETE", "POST", "PUT"],
  allowedHeaders: [
    "X-CSRF-Token",
    "X-Requested-With",
    "Accept",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Content-Type",
    "Date",
    "X-Api-Version",
  ],
  credentials: true,
};

const app: Express = express();

app.use(cors(corsOptions));

app.use(express.json());
app.use(
  expressSession({
    name: "sid",
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
    secret: process.env.SESSION_SECRET!,
    resave: true,
    saveUninitialized: true,
    // @ts-ignore
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // 2 mins
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/facility", facilityRouter);
app.use("/employee", approvalRouter);
app.use("/bookings", cancelRouter);
app.use("/admin", adminRouter);
app.use(notFound);
app.use(errorHandler);

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
    logger.info(
      `Starting Server on port ${PORT}, Server URL: http://localhost:${PORT}, database: ${process.env.DATABASE}, database URL: ${process.env.DATABASE_URL}`
    );
  });
};

process.on("unhandledRejection", (err: any) => {
  console.error(err);
  logger.error(err.message);
  process.exit(1);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

startServer();
