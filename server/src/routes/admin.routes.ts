import { Router } from "express";
import {
	addFacility,
	deleteFacility,
	getAllBookings,
	getFacilities,
	updateFacility,
} from "../controllers/admin.controller";
import validateAdmin from "../middleware/validateAdmin";
import validateSession from "../middleware/validateSession";

const adminRouter = Router();

adminRouter
	.route("/facility/add")
	.post(validateSession, validateAdmin, addFacility);
adminRouter
	.route("/facility")
	.post(validateSession, validateAdmin, deleteFacility)
	.put(validateSession, validateAdmin, updateFacility)
	.get(validateSession, validateAdmin, getFacilities);
adminRouter
	.route("/bookings")
	.get(validateSession, validateAdmin, getAllBookings);

export default adminRouter;
