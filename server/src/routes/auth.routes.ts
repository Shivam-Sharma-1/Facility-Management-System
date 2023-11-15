import express from "express";
import {
	authLogin,
	authLogout,
	changePassword,
} from "../controllers/auth.controllers";

import validateAdmin from "../middleware/validateAdmin";
import validateSession from "../middleware/validateSession";

const authRouter = express.Router();

authRouter.post("/login", authLogin);
authRouter.post("/logout", authLogout);
authRouter
	.route("/password")
	.post(validateSession, validateAdmin, changePassword);

export default authRouter;
