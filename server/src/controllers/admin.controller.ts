import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";
import logger from "../utils/logger";

/**
 * @description Get facilities for filtering in bookings
 * @method GET
 * @access private
 * @returns {Facility}
 */
export const getFacilities: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const buildings = await prisma.building.findMany({
			select: {
				name: true,
			},
		});
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
				building: {
					select: {
						name: true,
					},
				},
			},
		});
		res.status(200).json({ buildings, facilities });
	} catch (error) {
		console.error(error);
		logger.error(error.message);
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
		const { name, description, icon, slug, facilityManagerId, building } =
			req.body;

		const facilityManager = await prisma.user.findUnique({
			where: {
				employeeId: facilityManagerId,
			},
			select: {
				id: true,
			},
		});

		if (!facilityManager) {
			return next(createHttpError.NotFound("User does not exist."));
		}

		const facility = await prisma.$transaction([
			prisma.facility.create({
				data: {
					name,
					description,
					icon,
					slug,
					building: {
						connect: {
							name: building,
						},
					},
					facilityManager: {
						connectOrCreate: {
							where: {
								userId: facilityManager?.id,
							},
							create: {
								user: {
									connect: {
										employeeId: facilityManagerId,
									},
								},
							},
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
		logger.error(error.message);
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
				building: {
					select: {
						name: true,
					},
				},
				facilityManager: {
					select: {
						userId: true,
					},
				},
			},
		});
		const userFMCount = await prisma.facility.count({
			where: {
				facilityManager: {
					userId: facility?.facilityManager?.userId,
				},
			},
		});

		let deletedFacility;

		if (userFMCount > 1) {
			deletedFacility = await prisma.$transaction([
				prisma.facility.update({
					where: {
						slug,
					},
					data: {
						isActive: false,
						deletedAt: time,
					},
				}),
				prisma.facilityManager.update({
					where: {
						userId: facility?.facilityManager?.userId,
					},
					data: {
						facility: {
							disconnect: {
								slug,
							},
						},
					},
				}),
			]);
		} else {
			deletedFacility = await prisma.$transaction([
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
				prisma.user.update({
					where: {
						id: facility?.facilityManager?.userId,
					},
					data: {
						role: "USER",
					},
				}),
			]);
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
		logger.error(error.message);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

/**
 * @description Update facility
 * @method POST
 * @access private
 * @returns {Facility}
 */

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
			building,
		} = req.body;

		let newData = {};
		let updatedFacility;

		// set new data
		if (name) {
			newData = {
				...newData,
				name,
			};
		}

		if (description) {
			newData = {
				...newData,
				description,
			};
		}

		if (icon) {
			newData = {
				...newData,
				icon,
			};
		}

		if (building) {
			newData = {
				...newData,
				building: {
					connect: {
						name: building,
					},
				},
			};
		}

		// get previous facility manager
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

		// get new facility manager
		const newFacilityManager = await prisma.user.findFirst({
			where: {
				employeeId: newFacilityManagerId,
			},
			select: {
				id: true,
			},
		});

		if (!newFacilityManager || !prevFacilityManager) {
			return next(createHttpError.NotFound("Employee not found."));
		}

		// check if facility manager is changed
		if (
			prevFacilityManagerId &&
			newFacilityManagerId &&
			prevFacilityManagerId !== newFacilityManagerId
		) {
			newData = {
				...newData,
				facilityManager: {
					connectOrCreate: {
						where: {
							userId: newFacilityManager?.id,
						},
						create: {
							user: {
								connect: {
									employeeId: newFacilityManagerId,
								},
							},
						},
					},
				},
			};
		}

		// get count of facilities assigned to facility manager
		const userFMCount = await prisma.facility.count({
			where: {
				facilityManager: {
					userId: prevFacilityManager?.userId,
				},
			},
		});

		// check if facility manager is assigned to more than one facility
		if (userFMCount > 1) {
			// if facility manager is assigned to more than one facility, then only update facility manager
			if (
				prevFacilityManagerId &&
				newFacilityManagerId &&
				prevFacilityManagerId !== newFacilityManagerId
			) {
				await prisma.$transaction([
					prisma.facilityManager.update({
						where: {
							userId: prevFacilityManager?.userId,
						},
						data: {
							facility: {
								disconnect: {
									slug,
								},
							},
						},
					}),
					prisma.user.update({
						where: {
							employeeId: newFacilityManagerId,
						},
						data: {
							role: "FACILITY_MANAGER",
						},
					}),
				]);
			}

			updatedFacility = await prisma.facility.update({
				where: {
					slug,
				},
				data: {
					...newData,
				},
			});
		} else {
			// if facility manager is assigned to only one facility, then delete facility manager

			if (
				prevFacilityManagerId &&
				newFacilityManagerId &&
				prevFacilityManagerId !== newFacilityManagerId
			) {
				await prisma.$transaction([
					prisma.facilityManager.delete({
						where: {
							userId: prevFacilityManager?.userId,
						},
						// data: {
						// 	facility: {
						// 		disconnect: {
						// 			slug,
						// 		},
						// 	},
						// },
					}),
					prisma.user.update({
						where: {
							employeeId: newFacilityManagerId,
						},
						data: {
							role: "FACILITY_MANAGER",
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
				]);
			}

			updatedFacility = await prisma.facility.update({
				where: {
					slug,
				},
				data: {
					...newData,
				},
			});
		}

		if (!updatedFacility) {
			return next(
				createHttpError.InternalServerError(
					"Unable to delete facility. Please try again."
				)
			);
		}

		res.status(201).json(updateFacility);
	} catch (error) {
		console.error(error);
		logger.error(error.message);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

/**
 * @description Get all bookings
 * @method GET
 * @access private
 * @returns {Booking}
 */

export const getAllBookings: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { month, facility, year, user } = req.query;
		const facilities = await prisma.facility.findMany({
			where: {
				isActive: true,
			},
			select: {
				slug: true,
				name: true,
			},
		});
		let filterConditions = {};

		if (month && year) {
			const startDate = new Date(`${year}-${month}-01`);
			const endDate = new Date(`${year}-${month}-31`);
			startDate.setFullYear(parseInt(year as string));
			endDate.setFullYear(parseInt(year as string));

			filterConditions = {
				...filterConditions,
				time: {
					date: {
						gte: startDate,
						lt: endDate,
					},
				},
			};
		} else if (month && !year) {
			const startDate = new Date(`${month}-01`);
			const endDate = new Date(`${month}-31`);
			startDate.setFullYear(new Date().getFullYear());
			endDate.setFullYear(new Date().getFullYear());

			filterConditions = {
				time: {
					date: {
						gte: startDate,
						lt: endDate,
					},
				},
			};
		} else if (year && !month) {
			const startDate = new Date(`01-01-${year}`);
			const endDate = new Date(`12-31-${year}`);
			startDate.setFullYear(parseInt(year as string));
			endDate.setFullYear(parseInt(year as string));

			filterConditions = {
				...filterConditions,
				time: {
					date: {
						gte: startDate,
						lt: endDate,
					},
				},
			};
		}

		if (user && !isNaN(Number(user))) {
			const userExists = await prisma.user.findUnique({
				where: {
					employeeId: parseInt(user as string),
				},
			});
			if (userExists) {
				filterConditions = {
					...filterConditions,
					requestedBy: {
						employeeId: parseInt(user as string),
					},
				};
			} else if (!userExists) {
				return res.status(200).json({ bookings: [], facilities });
			}
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
				groupDirectorName: true,
				facilityManagerName: true,
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

		res.status(200).json({ facilities, bookings });
	} catch (error) {
		console.error(error.message);
		logger.error(error.message);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

/**
 * @description Approve Booking for admin
 * @method POST
 * @access private
 * @returns {Booking}
 */

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
		logger.error(error.message);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};
