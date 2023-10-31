import argon2 from "argon2";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";
import { AuthInput } from "../types/types";
import authSchema from "../utils/validation";

declare module "express-session" {
	export interface SessionData {
		userId: string;
	}
}

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
		const { employeeId, password }: AuthInput =
			await authSchema.validateAsync(req.body);
		const user = await prisma.user.findUnique({
			where: {
				employeeId,
			},
		});
		if (!user) {
			return next(createHttpError.Unauthorized("User does not exist."));
		}
		const validPassword = await argon2.verify(user.password, password);

		if (validPassword) {
			req.session.userId = user.employeeId;
		} else {
			return next(createHttpError.Unauthorized("Invalid credentials."));
		}
	} catch (error) {
		if (error.isJoi === true) {
			console.error(error);
			return next(
				createHttpError.BadRequest("Invalid employeeId/password")
			);
		}
		return next(createHttpError.Unauthorized("Invalid credentials."));
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
	req.session.destroy((err: any) => {
		if (err) {
			return next(
				createHttpError.InternalServerError(
					"Something went wrong. Please try again."
				)
			);
		} else {
			res.clearCookie("sid");
			res.status(200).json({ message: "Log out successful." });
		}
	});
};

/**
 * @description acess employee
 * @method GET
 * @access private
 * @returns {id, name, employeeId}
 */
export const getUser: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.session.userId;
		const user = await prisma.user.findUnique({
			where: {
				employeeId: userId,
			},
		});
		if (!user) {
			return next(createHttpError.NotFound("User not found."));
		}
		const data = {
			id: user.id,
			name: user.name,
			employeeId: user.employeeId,
		};
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

/**
 * @description Employee register
 * @method POST
 * @access public
 * @returns {id, image, name, employeeId, password}
 */
export const authRegister: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { image, name, employeeId, password }: AuthInput =
			await authSchema.validateAsync(req.body);
		const userExists = await prisma.user.findUnique({
			where: {
				employeeId,
			},
		});
		if (userExists) {
			return next(createHttpError.Conflict("User already exists."));
		}
		const hashedPassword = await argon2.hash(password);

		const user = await prisma.user.create({
			data: {
				image,
				name: name,
				employeeId: employeeId,
				password: hashedPassword,
			},
		});
		return res.status(200).json(user);
	} catch (error) {
		console.error(error);
		if (error.isJoi === true)
			return next(
				createHttpError.BadRequest("Invalid employee ID/password")
			);
		next(error);
	}
};
