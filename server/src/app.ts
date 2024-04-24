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
// const corsOptions = {
//   origin: [
//     "http://localhost:5173",
//     process.env.CLIENT_URL,
//     "https://facility-bookings-manager.vercel.app",
//     "http://localhost:5000",
//     "http://localhost:8000",
//   ],
//   credentials: true,
//   allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
// };

const app: Express = express();
app.use(cors());

app.use(function (req, res, next) {
	// res.header("Access-Control-Allow-Origin", "*");
	// res.header(
	// 	"Access-Control-Allow-Headers",
	// 	"Origin, X-Requested-With, Content-Type, Accept"
	// );
	// res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	// res.header("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,OPTIONS,PATCH,DELETE,POST,PUT"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
	);
	next();
});

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
// app.use(function (request, response, next) {
//   response.header("Access-Control-Allow-Origin", "*");
//   response.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

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
