import express from "express";
import {
	authLogin,
	authLogout,
	authRegister,
	getUser,
} from "../controllers/auth.controllers";

import validateSession from "../middleware/validateSession";

const authRouter = express.Router();

authRouter.post("/login", authLogin);
authRouter.post("/logout", authLogout);
authRouter.get("/user", validateSession, getUser);
authRouter.post("/register", authRegister);

export default authRouter;
