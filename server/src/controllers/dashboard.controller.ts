import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";

/**
 * @description Get all facilities
 * @method GET
 * @access private
 * @returns [{name, employeeId, role}, [facilities]]
 */
export const getFacilities: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let count = null;
		const employeeId = req.session.userId;
		const user = await prisma.user.findUnique({
			where: {
				employeeId,
			},
		});

		if (user?.role === "GROUP_DIRECTOR") {
			count = await prisma.booking.count({
				where: {
					AND: [
						{
							groupId: user.groupId,
						},
						{
							status: "PENDING",
						},
					],
				},
			});
		}

		if (user?.role === "FACILITY_MANAGER") {
			const facility = await prisma.facilityManager.findUnique({
				where: {
					userId: user.id,
				},
				select: {
					facilityId: true,
				},
			});

			count = await prisma.booking.count({
				where: {
					AND: [
						{
							facilityId: facility?.facilityId,
						},
						{
							status: "APPROVED_BY_GD",
						},
					],
				},
			});
		}
		const facilities = await prisma.facility.findMany({
			include: {
				facilityManager: {
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
		});
		if (!facilities) {
			return next(
				createHttpError.NotFound(
					"Something went wrong. Please try again."
				)
			);
		}
		res.status(200).json({ count, facilities });
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
 * @description Add facilities (temp route)
 * @method POST
 * @access private
 * @returns {Facility, transaction}
 */
export const addFacilities: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, slug, description, icon, facilityManagerId } = req.body;

		const facility = await prisma.facility.create({
			data: {
				slug,
				name,
				description,
				icon,
			},
		});
		if (!facility) {
			return next(
				createHttpError.InternalServerError(
					"Facility creation failed. Please try again."
				)
			);
		}
		const updateFM = await prisma.user.update({
			where: {
				employeeId: facilityManagerId,
			},
			data: {
				facilityManager: {
					create: {
						facilityId: facility.id,
					},
				},
			},
		});
		res.status(200).json({ facility, updateFM });
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
