import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";

export const getFacilities: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.session.userId;
		const data = [];
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				name: true,
				employee_id: true,
			},
		});
		if (!user) {
			req.session.destroy((err) => {
				if (err) {
					console.log(err);
				}
				res.clearCookie("sid");
			});
			return next(
				createHttpError.Unauthorized("Please login and try again.")
			);
		}
		data.push(user);
		const facilities = await prisma.facility.findMany();
		if (!facilities) {
			return next(
				createHttpError.InternalServerError(
					"Something went wrong. Please try again."
				)
			);
		}
		data.push(facilities);
		res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

export const addFacilities: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, description, icon, groupDirectorId, facilityManagerId } =
			req.body;

		const facility = await prisma.facility.create({
			data: {
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
					user: { connect: { employee_id: groupDirectorId } },
					facility: {
						connect: { id: facility.id },
					},
				},
			}),
			prisma.facilityManager.create({
				data: {
					user: { connect: { employee_id: facilityManagerId } },
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
	}
};