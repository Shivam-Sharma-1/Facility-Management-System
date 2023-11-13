import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const validateSession = (req: Request, res: Response, next: NextFunction) => {
	if (!req.session.userId) {
		return next(createHttpError.Unauthorized("You must be logged in."));
	} else {
		return next();
	}
};

export default validateSession;
