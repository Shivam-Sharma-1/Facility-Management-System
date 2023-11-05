import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";

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
		// dont delete facility manager
		const { slug } = req.body;
		const deletedFacility = await prisma.$transaction([
			prisma.facility.delete({
				where: {
					slug,
				},
			}),
			prisma.facilityManager.deleteMany({
				where: {
					facility: {
						slug,
					},
				},
			}),
		]);
		// const updateUser = await prisma.user.updateMany({
		// 	where: {
		// 		id: FM.map((fm) => fm.userId),
		// 	},
		// 	data: {
		// 		role: "USER",
		// 	},
		// })
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
) => {};
