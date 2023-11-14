import { Router } from "express";
import { getCount, getFacilities } from "../controllers/dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.route("/count/:employeeId").get(getCount);
dashboardRouter.route("/:employeeId").get(getFacilities);

export default dashboardRouter;
