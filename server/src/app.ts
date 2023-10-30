import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";

dotenv.config();

import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import expressSession from "express-session";
import prisma from "./db/prisma";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import authRouter from "./routes/auth.routes";
import dashboardRouter from "./routes/dashboard.routes";
import facilityRouter from "./routes/facility.routes";

const PORT = process.env.PORT || 3000;
const corsOptions = {
	origin: "http://localhost:5173",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
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
app.use(notFound);
app.use(errorHandler);

const startServer = () => {
	app.listen(PORT, () => {
		console.log(`Server listening at http://localhost:${PORT}`);
	});
};

startServer();
