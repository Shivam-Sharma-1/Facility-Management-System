import { Router } from "express";
import validateSession from "src/middleware/validateSession";
import {
	getCount,
	getEmployeeDetails,
	getFacilities,
} from "../controllers/dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.route("/count/:employeeId").get(validateSession, getCount);
dashboardRouter.route("/employee/:employeeId").get(getEmployeeDetails);
dashboardRouter.route("/").get(validateSession, getFacilities);

export default dashboardRouter;
