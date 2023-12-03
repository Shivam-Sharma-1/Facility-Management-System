import { Router } from "express";
import {
	approveCancellationRequestFM,
	approveCancellationRequestGD,
	directCancellation,
	getAllCancellationRequestsFM,
	getAllCancellationRequestsGD,
	requestCancellation,
} from "../controllers/cancellation.controller";
import validateSession from "../middleware/validateSession";

const cancelRouter = Router();

cancelRouter.route("/cancel").post(validateSession, requestCancellation);

cancelRouter
	.route("/cancel/gd")
	.get(validateSession, getAllCancellationRequestsGD)
	.post(validateSession, approveCancellationRequestGD);
cancelRouter
	.route("/cancel/fm")
	.get(validateSession, getAllCancellationRequestsFM)
	.post(validateSession, approveCancellationRequestFM);
cancelRouter
	.route("/cancel/facility")
	.post(validateSession, directCancellation);

export default cancelRouter;
