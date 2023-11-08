import { Router } from "express";
import {
	addBookings,
	getBookings,
	getBookingsForFacility,
	getBookingsForGroup,
} from "../controllers/facility.controller";
import validateSession from "../middleware/validateSession";

const facilityRouter = Router();

facilityRouter.route("/bookings").get(validateSession, getBookingsForFacility);
facilityRouter.route("/bookings/gd").get(validateSession, getBookingsForGroup);
facilityRouter
	.route("/:slug")
	.get(validateSession, getBookings)
	.post(validateSession, addBookings);

export default facilityRouter;
