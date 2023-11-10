import { Router } from "express";
import {
	addFacilities,
	getFacilities,
} from "../controllers/dashboard.controller";
import validateSession from "../middleware/validateSession";

const dashboardRouter = Router();

dashboardRouter.route("/").get(validateSession, getFacilities);
dashboardRouter.route("/facility/add").post(validateSession, addFacilities);

export default dashboardRouter;
