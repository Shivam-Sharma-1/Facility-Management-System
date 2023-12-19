import express from "express";
import {
  authLogin,
  authLogout,
  authRegister,
  changePassword,
} from "../controllers/auth.controllers";
import validateSession from "../middleware/validateSession";

const authRouter = express.Router();

authRouter.post("/login", authLogin);
authRouter.post("/logout", authLogout);
authRouter.post("/register", authRegister);
authRouter.post("/change-password", validateSession, changePassword);

export default authRouter;
