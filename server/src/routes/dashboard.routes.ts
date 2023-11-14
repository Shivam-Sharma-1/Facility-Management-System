import { Router } from "express";
import { getCount, getFacilities } from "../controllers/dashboard.controller";
import validateSession from "../middleware/validateSession";

const dashboardRouter = Router();

dashboardRouter.route("/count/:employeeId").get(validateSession, getCount);
dashboardRouter.route("/:employeeId").get(validateSession, getFacilities);

export default dashboardRouter;
