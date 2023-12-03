import express from "express";
import { authLogin, authLogout } from "../controllers/auth.controllers";

const authRouter = express.Router();

authRouter.post("/login", authLogin);
authRouter.post("/logout", authLogout);

export default authRouter;
