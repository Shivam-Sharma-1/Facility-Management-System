import { ApprovalStatus } from "@prisma/client";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";

/**
 * @description Get all bookings done by user
 * @method GET
 * @access private
 * @returns {booking[]}
 */
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
				remark: true,
				time: {
					select: {
						start: true,
						end: true,
						date: true,
					},
				},
				statusUpdateAtGD: true,
				statusUpdateAtFM: true,
				statusUpdateAtAdmin: true,
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
				statusUpdateByFM: {
					select: {
						user: {
							select: {
								name: true,
								employeeId: true,
							},
						},
					},
				},
				statusUpdateByGD: {
					select: {
						user: {
							select: {
								name: true,
								employeeId: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: "desc",
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

/**
 * @description Get all bookings for approval by Group Director
 * @method GET
 * @access private
 * @returns {booking[]}
 */
export const getAllGDApprovals: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.session.userId;
		const bookings = await prisma.booking.findMany({
			where: {
				AND: [
					{
						group: {
							groupDirector: {
								user: {
									employeeId,
								},
							},
						},
					},
					{
						status: "PENDING",
					},
				],
			},
			select: {
				id: true,
				title: true,
				slug: true,
				purpose: true,
				status: true,
				createdAt: true,
				time: {
					select: {
						start: true,
						end: true,
						date: true,
					},
				},
				requestedBy: {
					select: {
						name: true,
						employeeId: true,
					},
				},
				facility: {
					select: {
						name: true,
						slug: true,
					},
				},
			},
		});
		if (!bookings) {
			return next(
				createHttpError.Forbidden(
					"You do not have permission to access this resource."
				)
			);
		}
		res.status(200).json(bookings);
	} catch (error) {
		console.error(error);
		return next(createHttpError.InternalServerError(error.message));
	}
};

/**
 * @description Get all bookings for approval by Facility Manager
 * @method GET
 * @access private
 * @returns {booking[]}
 */
export const getAllFMApprovals: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.session.userId;
		const bookings = await prisma.facilityManager.findFirst({
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
							select: {
								id: true,
								slug: true,
								title: true,
								purpose: true,
								status: true,
								createdAt: true,
								time: {
									select: {
										start: true,
										end: true,
										date: true,
									},
								},
								requestedBy: {
									select: {
										name: true,
										employeeId: true,
									},
								},
								facility: {
									select: {
										name: true,
										slug: true,
									},
								},
								statusUpdateByGD: {
									select: {
										user: {
											select: {
												name: true,
												employeeId: true,
											},
										},
									},
								},
								statusUpdateAtGD: true,
							},
						},
					},
				},
			},
		});
		if (!bookings) {
			return next(
				createHttpError.Forbidden(
					"You do not have permission to access this resource."
				)
			);
		}
		res.status(200).json(bookings.facility.bookings);
	} catch (error) {
		console.error(error);
		return next(createHttpError.InternalServerError(error.message));
	}
};

/**
 * @description Approve a booking slot by Group Director
 * @method POST
 * @access private
 * @returns {booking}
 */
export const approveByGD: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { slug, approved, remark } = req.body;
		const employeeId = req.session.userId;
		const time = new Date().toISOString();
		let status: ApprovalStatus = "PENDING";
		if (approved === true) {
			status = "APPROVED_BY_GD";
		} else {
			status = "REJECTED_BY_GD";
		}
		const user = await prisma.user.findUnique({
			where: {
				employeeId,
			},
			select: {
				id: true,
			},
		});
		if (!user) {
			return next(
				createHttpError.InternalServerError(
					"Something went wrong. Please try again."
				)
			);
		}
		const booking = await prisma.booking.update({
			where: {
				slug,
			},
			data: {
				status,
				remark,
				statusUpdateAtGD: time,
				statusUpdateByGD: {
					connect: {
						userId: user?.id,
					},
				},
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

/**
 * @description Approve a booking slot by Facility Manager
 * @method POST
 * @access private
 * @returns {booking}
 */
export const approveByFM: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { slug, approved, remark } = req.body;
		const employeeId = req.session.userId;
		const time = new Date().toISOString();
		let status: ApprovalStatus = "PENDING";
		if (approved === true) {
			status = "APPROVED_BY_FM";
		} else {
			status = "REJECTED_BY_FM";
		}
		const user = await prisma.user.findUnique({
			where: {
				employeeId,
			},
			select: {
				id: true,
			},
		});
		if (!user) {
			return next(
				createHttpError.InternalServerError(
					"Something went wrong. Please try again."
				)
			);
		}
		const booking = await prisma.booking.update({
			where: {
				slug,
			},
			data: {
				status,
				remark,
				statusUpdateAtFM: time,
				statusUpdateByFM: {
					connect: {
						userId: user?.id,
					},
				},
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
