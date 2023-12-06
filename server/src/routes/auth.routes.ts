import express from "express";
import {
  authLogin,
  authLogout,
  authRegister,
} from "../controllers/auth.controllers";

const authRouter = express.Router();

authRouter.post("/login", authLogin);
authRouter.post("/logout", authLogout);
authRouter.post("/register", authRegister);

export default authRouter;
