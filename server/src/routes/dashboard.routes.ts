import { Router } from "express";
import {
	getCount,
	getEmployeeDetails,
	getFacilities,
} from "../controllers/dashboard.controller";
import validateSession from "../middleware/validateSession";

const dashboardRouter = Router();

dashboardRouter.route("/count/:employeeId").get(validateSession, getCount);
dashboardRouter.route("/employee/:employeeId").get(getEmployeeDetails);
dashboardRouter.route("/").get(validateSession, getFacilities);

export default dashboardRouter;
