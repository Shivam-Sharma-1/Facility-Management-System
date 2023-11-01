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
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const facilities = await prisma.facility.findMany();
		if (!facilities) {
			return next(
				createHttpError.NotFound(
					"Something went wrong. Please try again."
				)
			);
		}
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
		const {
			name,
			slug,
			description,
			icon,
			groupDirectorId,
			facilityManagerId,
		} = req.body;

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
		const transaction = await prisma.$transaction([
			prisma.groupDirector.create({
				data: {
					user: { connect: { employeeId: groupDirectorId } },
					facility: {
						connect: { id: facility.id },
					},
				},
			}),
			prisma.facilityManager.create({
				data: {
					user: { connect: { employeeId: facilityManagerId } },
					facility: {
						connect: { id: facility.id },
					},
				},
			}),
		]);
		if (!transaction) {
			return next(
				createHttpError.InternalServerError(
					"Group Director / Facility Manager could not be updated. Please try again."
				)
			);
		}
		res.status(200).json({ facility, transaction });
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
