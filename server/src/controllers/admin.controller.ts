import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";

export const getFacilities: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const facilities = await prisma.facility.findMany({
			include: {
				facilityManager: {
					select: {
						user: {
							select: {
								employeeId: true,
								name: true,
							},
						},
					},
				},
			},
		});
		res.status(200).json(facilities);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

/**
 * @description Add facilities
 * @method POST
 * @access private
 * @returns {Facility}
 */
export const addFacility: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, description, icon, slug, facilityManagerId } = req.body;

		const facilityManager = await prisma.user.findUnique({
			where: {
				employeeId: facilityManagerId,
			},
			select: {
				id: true,
			},
		});

		const facility = await prisma.$transaction([
			prisma.facility.create({
				data: {
					name,
					description,
					icon,
					slug,
					facilityManager: {
						create: {
							userId: facilityManager?.id!,
						},
					},
				},
			}),
			prisma.user.update({
				where: {
					id: facilityManager?.id!,
				},
				data: {
					role: "FACILITY_MANAGER",
				},
			}),
		]);

		if (!facility) {
			return next(
				createHttpError.InternalServerError(
					"Something went wrong. Please try again."
				)
			);
		}

		res.status(200).json(facility);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

/**
 * @description Delete facilities
 * @method POST
 * @access private
 * @returns {Facility}
 */
export const deleteFacility: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { slug } = req.body;
		const time = new Date().toISOString();
		const facility = await prisma.facility.findFirst({
			where: {
				slug,
			},
			select: {
				facilityManager: {
					select: {
						userId: true,
					},
				},
			},
		});
		const userFMCount = await prisma.user.count({
			where: {
				facilityManager: {
					userId: facility?.facilityManager?.userId,
				},
			},
		});
		const deletedFacility = await prisma.$transaction([
			prisma.facility.update({
				where: {
					slug,
				},
				data: {
					isActive: false,
					deletedAt: time,
				},
			}),
			prisma.facilityManager.delete({
				where: {
					userId: facility?.facilityManager?.userId,
				},
			}),
		]);

		if (userFMCount < 1) {
			await prisma.user.update({
				where: {
					id: facility?.facilityManager?.userId,
				},
				data: {
					role: "USER",
				},
			});
		}

		if (!deletedFacility) {
			return next(
				createHttpError.InternalServerError(
					"Unable to delete facility. Please try again."
				)
			);
		}
		res.status(200).json(deletedFacility);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};
export const updateFacility: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			slug,
			name,
			description,
			newFacilityManagerId,
			prevFacilityManagerId,
			icon,
		} = req.body;
		const prevFacilityManager = await prisma.facilityManager.findFirst({
			where: {
				user: {
					employeeId: prevFacilityManagerId,
				},
			},
			select: {
				userId: true,
			},
		});
		const facility = await prisma.$transaction([
			prisma.facility.update({
				where: {
					slug,
				},
				data: {
					name,
					description,
					icon,
				},
			}),
			prisma.facilityManager.delete({
				where: {
					userId: prevFacilityManager?.userId,
				},
			}),
			prisma.user.update({
				where: {
					employeeId: prevFacilityManagerId,
				},
				data: {
					role: "USER",
				},
			}),
			prisma.user.update({
				where: {
					employeeId: newFacilityManagerId,
				},
				data: {
					role: "FACILITY_MANAGER",
					facilityManager: {
						create: {
							facility: {
								connect: {
									slug,
								},
							},
						},
					},
				},
			}),
		]);
		res.status(201).json(facility);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

export const getAllBookings: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { month, facility } = req.query;
		let filterConditions = {};

		if (month) {
			// Parse the month parameter as a Date object
			const startDate = new Date(`${month}-01`);
			const endDate = new Date(`${month}-31`);
			startDate.setFullYear(new Date().getFullYear());
			endDate.setFullYear(new Date().getFullYear());

			filterConditions = {
				...filterConditions,

				createdAt: {
					gte: startDate,
					lt: endDate,
				},
			};
		}

		if (facility) {
			filterConditions = {
				AND: [
					{ ...filterConditions },
					{
						facility: {
							slug: facility,
						},
					},
				],
			};
		}

		const bookings = await prisma.booking.findMany({
			where: filterConditions,
			select: {
				title: true,
				purpose: true,
				status: true,
				slug: true,
				createdAt: true,
				remark: true,
				cancellationStatus: true,
				cancellationRemark: true,
				cancelledAt: true,
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
		const facilities = await prisma.facility.findMany({
			where: {
				isActive: true,
			},
			select: {
				slug: true,
				name: true,
			},
		});
		res.status(200).json({ facilities, bookings });
	} catch (error) {
		console.error(error.message);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

export const approveBooking: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { slug, approved, remark } = req.body;
		const time = new Date().toISOString();

		const booking = await prisma.booking.update({
			where: {
				slug,
			},
			data: {
				status: approved ? "APPROVED_BY_ADMIN" : "REJECTED_BY_ADMIN",
				remark,
				statusUpdateAtAdmin: time,
			},
		});
		if (!booking) {
			return next(
				createHttpError.BadRequest(
					"Something went wrong. Please try again."
				)
			);
		}
		res.status(200).json(booking);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};
