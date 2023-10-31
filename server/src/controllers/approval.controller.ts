import { ApprovalStatus } from "@prisma/client";
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
		const events = await prisma.groupDirector.findFirst({
			where: {
				user: {
					employeeId: employeeId,
				},
			},
			select: {
				facility: {
					select: {
						bookings: {
							where: {
								status: "PENDING",
							},
						},
					},
				},
			},
		});
		if (!events) {
			return next(
				createHttpError.Forbidden(
					"You do not have permission to access this resource."
				)
			);
		}
		res.status(200).json(events.facility.bookings);
	} catch (error) {
		console.error(error);
		return next(createHttpError.InternalServerError(error.message));
	}
};

export const getAllFMApprovals: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.session.userId;
		const events = await prisma.facilityManager.findFirst({
			where: {
				user: {
					employeeId,
				},
			},
			select: {
				facility: {
					select: {
						bookings: {
							where: {
								status: "APPROVED_BY_GD",
							},
						},
					},
				},
			},
		});
		if (!events) {
			return next(
				createHttpError.Forbidden(
					"You do not have permission to access this resource."
				)
			);
		}
		res.status(200).json(events.facility.bookings);
	} catch (error) {
		console.error(error);
		return next(createHttpError.InternalServerError(error.message));
	}
};

export const approveByGD: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { slug, approved } = req.body;
		const time = new Date().toISOString();
		let status: ApprovalStatus = "PENDING";
		if (approved === true) {
			status = "APPROVED_BY_GD";
		} else {
			status = "REJECTED";
		}
		const booking = await prisma.booking.update({
			where: {
				slug,
			},
			data: {
				status,
				approvedAtGD: time,
			},
		});
		if (!booking) {
			return next(
				createHttpError.InternalServerError(
					"Something went wrong. Please try again."
				)
			);
		}
		res.status(200).json(booking);
	} catch (error) {
		console.error(error);
		return next(createHttpError.InternalServerError(error.message));
	}
};

export const approveByFM: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { slug, approved } = req.body;
		const time = new Date().toISOString();
		let status: ApprovalStatus = "PENDING";
		if (approved === true) {
			status = "APPROVED_BY_FM";
		} else {
			status = "REJECTED";
		}
		const booking = await prisma.booking.update({
			where: {
				slug: slug,
			},
			data: {
				status,
				approvedAtFM: time,
			},
		});
		if (!booking) {
			return next(
				createHttpError.InternalServerError(
					"Something went wrong. Please try again."
				)
			);
		}
		res.status(200).json(booking);
	} catch (error) {
		console.error(error);
		return next(createHttpError.InternalServerError(error.message));
	}
};
