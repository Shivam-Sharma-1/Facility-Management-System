import express from "express";
import {
	addGroupDirector,
	authLogin,
	authLogout,
	authRegister,
	createGroup,
	getUser,
} from "../controllers/auth.controllers";

import validateSession from "../middleware/validateSession";

const authRouter = express.Router();

authRouter.post("/login", authLogin);
authRouter.post("/logout", authLogout);
authRouter.get("/user", validateSession, getUser);
authRouter.post("/register", authRegister);
authRouter.post("/group", createGroup);
authRouter.post("/group/gd", addGroupDirector);

export default authRouter;
