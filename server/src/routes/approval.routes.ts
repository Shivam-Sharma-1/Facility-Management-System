import { Router } from "express";
import { getAllUserBookings } from "../controllers/approval.controller";
import validateSession from "../middleware/validateSession";

const approvalRouter = Router();

approvalRouter.route("/status").get(validateSession, getAllUserBookings);

export default approvalRouter;
