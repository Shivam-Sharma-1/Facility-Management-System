import express from "express";
import {
	addGroupDirector,
	authLogin,
	authLogout,
	authRegister,
	changePassword,
	createGroup,
	getUser,
} from "../controllers/auth.controllers";

import validateAdmin from "../middleware/validateAdmin";
import validateSession from "../middleware/validateSession";

const authRouter = express.Router();

authRouter.post("/login", authLogin);
authRouter.post("/logout", authLogout);
authRouter
	.route("/password")
	.post(validateSession, validateAdmin, changePassword);
authRouter.get("/user", validateSession, getUser);
authRouter.post("/register", authRegister);
authRouter.post("/group", createGroup);
authRouter.post("/group/gd", addGroupDirector);

export default authRouter;
