import { Router } from "express";
import { getCount, getFacilities } from "../controllers/dashboard.controller";
import validateSession from "../middleware/validateSession";

const dashboardRouter = Router();

dashboardRouter.route("/").get(validateSession, getFacilities);
dashboardRouter.route("/count/:employeeId").get(validateSession, getCount);

export default dashboardRouter;
