import { Router } from "express";
import {
	addFacility,
	deleteFacility,
	updateFacility,
} from "../controllers/admin.controller";
import validateSession from "../middleware/validateSession";

const adminRouter = Router();

adminRouter.route("/facility/add").post(validateSession, addFacility);
adminRouter
	.route("/facility")
	.post(validateSession, deleteFacility)
	.put(validateSession, updateFacility);

export default adminRouter;
