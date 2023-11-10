import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import { BookingInput } from "src/types/types";
import prisma from "../db/prisma";

/**
 * @description Get all approved bookings
 * @method GET
 * @access private
 * @returns {bookings[]}
 */
export const getBookings: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const facilitySlug = req.params.slug;
		const events = await prisma.booking.findMany({
			where: {
				facility: {
					slug: facilitySlug,
				},
				OR: [
					{ status: "APPROVED_BY_FM" },
					{ status: "APPROVED_BY_GD" },
					{ status: "APPROVED_BY_ADMIN" },
					{ status: "PENDING" },
				],
			},
			orderBy: {
				time: {
					start: "desc",
				},
			},
			select: {
				id: true,
				title: true,
				slug: true,
				purpose: true,
				status: true,
				createdAt: true,
				statusUpdateAtGD: true,
				statusUpdateAtFM: true,
				statusUpdateAtAdmin: true,
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
		res.status(200).json(events);
	} catch (error) {
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

/**
 * @description Book a slot
 * @method POST
 * @access private
 * @returns {booking}
 */
export const addBookings: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { title, slug, purpose, date, start, end }: BookingInput =
			req.body;
		const facilitySlug = req.params.slug;
		const employeeId = req.session.userId;
		const user = await prisma.user.findUnique({
			where: {
				employeeId,
			},
			select: {
				groupId: true,
			},
		});
		const event = await prisma.booking.create({
			data: {
				title,
				slug,
				purpose,
				requestedBy: { connect: { employeeId } },
				facility: { connect: { slug: facilitySlug } },
				time: {
					create: {
						date,
						start,
						end,
					},
				},
				group: {
					connect: {
						id: user?.groupId!,
					},
				},
			},
		});
		if (!event) {
			return next(
				createHttpError.InternalServerError(
					"Something went wrong. Please try again."
				)
			);
		}
		res.status(201).json(event);
	} catch (error) {
		console.error(error);
		if (error instanceof PrismaClientValidationError) {
			return next(createHttpError.BadRequest("Missing data fields."));
		}
		if (error.code === "P2002") {
			return next(
				createHttpError.Conflict(
					`Field ${error.meta.target} must be unique.`
				)
			);
		}
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

/**
 * @description get all bookings of the particular facility for facility manager
 * @method GET
 * @access private
 * @returns {booking}
 */

export const getBookingsForFacility: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.session.userId;
		const facilityManager = await prisma.user.findFirst({
			where: {
				AND: [{ employeeId }, { role: "FACILITY_MANAGER" }],
			},
		});
		if (!facilityManager) {
			return next(
				createHttpError.Unauthorized(
					"You do not have permission to access this route."
				)
			);
		}

		const bookings = await prisma.facilityManager.findFirst({
			where: {
				userId: facilityManager.id,
			},
			select: {
				facility: {
					select: {
						bookings: {
							select: {
								id: true,
								title: true,
								slug: true,
								purpose: true,
								status: true,
								createdAt: true,
								remark: true,
								statusUpdateAtGD: true,
								statusUpdateAtFM: true,
								statusUpdateAtAdmin: true,
								cancelledAt: true,
								cancellationRemark: true,
								cancellationRequestedAt: true,
								cancellationStatus: true,
								cancellationUpdateAtGD: true,
								cancellationUpdateAtFM: true,
								cancellationUpdateAtAdmin: true,
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
						},
					},
				},
			},
		});

		res.status(200).json(bookings?.facility.bookings);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

export const getBookingsForGroup: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.session.userId;
		const bookings = await prisma.groupDirector.findFirst({
			where: {
				AND: [
					{
						user: {
							employeeId,
						},
					},
					{
						user: {
							role: "GROUP_DIRECTOR",
						},
					},
				],
			},
			select: {
				group: {
					select: {
						bookings: {
							select: {
								id: true,
								title: true,
								slug: true,
								purpose: true,
								status: true,
								createdAt: true,
								remark: true,
								statusUpdateAtGD: true,
								statusUpdateAtFM: true,
								statusUpdateAtAdmin: true,
								cancelledAt: true,
								cancellationRemark: true,
								cancellationRequestedAt: true,
								cancellationStatus: true,
								cancellationUpdateAtGD: true,
								cancellationUpdateAtFM: true,
								cancellationUpdateAtAdmin: true,
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
						},
					},
				},
			},
		});
		if (!bookings) {
			return next(
				createHttpError.Unauthorized(
					"You do not have permission to access this route."
				)
			);
		}
		res.status(200).json(bookings.group.bookings);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};
