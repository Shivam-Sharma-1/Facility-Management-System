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
	} finally {
		prisma.$disconnect();
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
	} finally {
		prisma.$disconnect();
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
		const facilityManager = await prisma.facilityManager.findFirst({
			where: {
				facility: {
					slug,
				},
			},
			select: {
				userId: true,
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
					userId: facilityManager?.userId,
				},
			}),
			prisma.user.update({
				where: {
					id: facilityManager?.userId,
				},
				data: {
					role: "USER",
				},
			}),
		]);

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
	} finally {
		prisma.$disconnect();
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
