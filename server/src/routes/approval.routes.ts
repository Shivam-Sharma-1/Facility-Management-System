import { Router } from "express";
import {
	approveByFM,
	approveByGD,
	getAllFMApprovals,
	getAllGDApprovals,
	getAllUserBookings,
} from "../controllers/approval.controller";
import validateSession from "../middleware/validateSession";

const approvalRouter = Router();

approvalRouter.route("/status").get(validateSession, getAllUserBookings);
approvalRouter.route("/approvals/gd").get(validateSession, getAllGDApprovals);
approvalRouter.route("/approvals/fm").get(validateSession, getAllFMApprovals);
approvalRouter.route("/approvals/gd").post(validateSession, approveByGD);
approvalRouter.route("/approvals/fm").post(validateSession, approveByFM);

export default approvalRouter;
