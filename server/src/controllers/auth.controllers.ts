import argon2 from "argon2";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";

import prisma from "../db/prisma";
import { AuthInput } from "../types/types";
import logger from "../utils/logger";

/**
 * @description Employee login
 * @method POST
 * @access public
 * @returns {name, employeeId, message}
 */
export const authLogin: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { employeeId, fullName, image }: AuthInput = req.body;
		let user = await prisma.user.findUnique({
			where: {
				employeeId: parseInt(employeeId),
			},
		});
		if (!user) {
			user = await prisma.user.create({
				data: {
					employeeId: parseInt(employeeId),
					name: fullName,
					image,
					isSignedIn: true,
				},
			});
		} else if (user.name !== fullName || user.image !== image) {
			await prisma.user.update({
				where: {
					employeeId: parseInt(employeeId),
				},
				data: {
					name: fullName,
					image,
					isSignedIn: true,
				},
			});
		} else {
			await prisma.user.update({
				where: {
					employeeId: parseInt(employeeId),
				},
				data: {
					isSignedIn: true,
				},
			});
		}
		res.status(200).send("Login successful.");
	} catch (error) {
		console.error(error);
		logger.error(error.message);
		return next(createHttpError.BadRequest("Please try again."));
	}
};

/**
 * @description Employee Logout
 * @method POST
 * @access public
 * @returns {message}
 */
export const authLogout: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { employeeId } = req.body;

		await prisma.user.update({
			where: {
				employeeId: parseInt(employeeId),
			},
			data: {
				isSignedIn: false,
			},
		});

		await prisma.session.deleteMany({
			where: {
				data: {
					contains: `"userId":${employeeId}`,
				},
			},
		});
		res.status(200).send("Logout successful.");
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
