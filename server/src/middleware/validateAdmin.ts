import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";

const validateAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const adminId = req.session.userId;

	const adminRole = await prisma.user.findFirst({
		where: {
			employeeId: adminId,
		},
		select: {
			role: true,
		},
	});

	if (adminRole?.role !== Role.ADMIN && adminId) {
		return next(
			createHttpError.Unauthorized(
				"You are not authorized to access this resource."
			)
		);
	}
	return next();
};

export default validateAdmin;
