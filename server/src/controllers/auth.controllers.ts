import argon2 from "argon2";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";
import authSchema from "../utils/validation";

declare module "express-session" {
	export interface SessionData {
		userId: number;
	}
}

export const authLogin: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { employee_id, password } = await authSchema.validateAsync(
			req.body
		);
		const user = await prisma.user.findUnique({
			where: {
				employee_id,
			},
		});
		if (!user) {
			return next(createHttpError.NotFound("User does not exist."));
		}
		const validPassword = await argon2.verify(user.password, password);

		if (validPassword) {
			req.session.userId = user.id;
			res.status(200).json({
				id: user.id,
				employeeId: user.employee_id,
				message: "Authenticated",
			});
		} else {
			return next(createHttpError.Unauthorized("Invalid credentials."));
		}
	} catch (error) {
		if (error.isJoi === true)
			return next(
				createHttpError.BadRequest("Invalid username/password")
			);
		return next(createHttpError.Unauthorized("Invalid credentials."));
	}
};

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

export const getUser: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.session.userId;
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!user) {
			return next(createHttpError.NotFound("User not found."));
		}
		const data = {
			id: user.id,
			name: user.name,
			employeeId: user.employee_id,
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

export const authRegister: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, employee_id, password } = await authSchema.validateAsync(
			req.body
		);
		const userExists = await prisma.user.findUnique({
			where: {
				employee_id,
			},
		});
		if (userExists) {
			return next(createHttpError.Conflict("User already exists."));
		}
		const hashedPassword = await argon2.hash(password);

		const user = await prisma.user.create({
			data: {
				name: name,
				employee_id: employee_id,
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
