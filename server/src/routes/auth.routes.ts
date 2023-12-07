import express from "express";
import {
	authLogin,
	authLogout,
	changePassword,
} from "../controllers/auth.controllers";
import validateSession from "../middleware/validateSession";

const authRouter = express.Router();

authRouter.post("/login", authLogin);
authRouter.post("/logout", authLogout);
authRouter.post("/change-password", validateSession, changePassword);

export default authRouter;
