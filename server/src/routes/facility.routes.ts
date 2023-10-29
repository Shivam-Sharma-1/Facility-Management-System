import { Router } from "express";
import { addBookings, getBookings } from "../controllers/facility.controller";
import validateSession from "../middleware/validateSession";

const facilityRouter = Router();

facilityRouter
	.route("/:slug")
	.get(validateSession, getBookings)
	.post(validateSession, addBookings);

export default facilityRouter;
