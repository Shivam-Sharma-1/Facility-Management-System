import { Router } from "express";
import {
	addBookings,
	getBookings,
	getBookingsForFacility,
} from "../controllers/facility.controller";
import validateSession from "../middleware/validateSession";

const facilityRouter = Router();

facilityRouter.route("/bookings").get(validateSession, getBookingsForFacility);
facilityRouter
	.route("/:slug")
	.get(validateSession, getBookings)
	.post(validateSession, addBookings);

export default facilityRouter;
