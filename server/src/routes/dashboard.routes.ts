import { Router } from "express";
import { getFacilities } from "../controllers/dashboard.controller";
import validateSession from "../middleware/validateSession";

const dashboardRouter = Router();

dashboardRouter.route("/").get(validateSession, getFacilities);

export default dashboardRouter;
