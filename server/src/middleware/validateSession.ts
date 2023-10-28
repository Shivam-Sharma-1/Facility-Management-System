import { NextFunction, Request, Response } from "express";

const validateSession = (req: Request, res: Response, next: NextFunction) => {
	if (!req.session.userId) {
		return res.status(401).json({ authenticated: false });
	} else {
		return next();
	}
};

export default validateSession;
