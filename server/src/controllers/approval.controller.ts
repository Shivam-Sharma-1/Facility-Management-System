import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";

export const getAllUserBookings: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.session.userId;
		const bookings = await prisma.booking.findMany({
			where: {
				requestedBy: {
					employeeId: employeeId,
				},
			},
			select: {
				title: true,
				purpose: true,
				status: true,
				createdAt: true,
				startTime: true,
				endTime: true,
				approvedAtGD: true,
				approvedAtFM: true,
				approvedAtAdmin: true,
				requestedBy: {
					select: {
						name: true,
						employeeId: true,
					},
				},
				facility: {
					select: {
						name: true,
					},
				},
			},
		});
		res.status(200).json(bookings);
	} catch (error) {
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

export const getAllGDApprovals: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.session.userId;
		const bookings = await prisma.groupDirector.findFirst({
			where: {
				user: {
					employeeId: employeeId,
				},
			},
		});
	} catch (error) {
		console.error(error);
		return next(createHttpError.InternalServerError(error.message));
	}
};
