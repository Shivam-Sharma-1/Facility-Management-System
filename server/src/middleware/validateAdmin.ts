import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const validateAdmin = (req: Request, res: Response, next: NextFunction) => {
	const adminId = req.session.userId;

	if (adminId !== 9999) {
		return next(
			createHttpError.Unauthorized(
				"You are not authorized to access this resource."
			)
		);
	}
	return next();
};

export default validateAdmin;
