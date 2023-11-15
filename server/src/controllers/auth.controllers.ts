import argon2 from "argon2";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";

import prisma from "../db/prisma";
import { AuthInput } from "../types/types";

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
		const { employeeId, fullName }: AuthInput = req.body;
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
				},
			});
		}
	} catch (error) {
		console.error(error);
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

		await prisma.session.deleteMany({
			where: {
				data: {
					contains: `"userId":${employeeId}`,
				},
			},
		});
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
 * @description change password
 * @method POST
 * @access private
 * @returns {message}
 */
export const changePassword: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { oldPassword, newPassword } = req.body;
		const adminId = req.session.userId;

		const admin = await prisma.user.findUnique({
			where: {
				employeeId: adminId,
			},
		});
		if (!admin) {
			return next(createHttpError.Unauthorized("User does not exist."));
		}
		const verifyOldPassword = await argon2.verify(
			admin.password!,
			oldPassword
		);
		if (!verifyOldPassword) {
			return next(createHttpError.BadRequest("Invalid old password."));
		}
		const hashedPassword = await argon2.hash(newPassword);
		await prisma.user.update({
			where: {
				employeeId: adminId,
			},
			data: {
				password: hashedPassword,
			},
		});

		await prisma.session.deleteMany({
			where: {
				data: {
					contains: '"userId":9999',
				},
			},
		});
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};
