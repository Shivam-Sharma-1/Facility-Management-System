import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import { bookingInput } from "src/types/types";
import prisma from "../db/prisma";

export const getBookings: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const facilitySlug = req.params.slug;
		const events = await prisma.booking.findMany({
			where: {
				facility: {
					slug: facilitySlug,
				},
				OR: [
					{ status: "APPROVED_BY_FM" },
					{ status: "APPROVED_BY_ADMIN" },
				],
			},
			orderBy: {
				startTime: "desc", // Or 'desc' for descending order
			},
			include: {
				requestedBy: {
					select: {
						name: true,
						employeeId: true,
					},
				},
			},
		});
		res.status(200).json(events);
	} catch (error) {
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};

export const addBookings: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			title,
			slug,
			purpose,
			employeeId,
			startTime,
			endTime,
		}: bookingInput = req.body;
		const facilitySlug = req.params.slug;
		const event = await prisma.booking.create({
			data: {
				title,
				slug,
				purpose,
				startTime,
				endTime,
				requestedBy: { connect: { employeeId } },
				facility: { connect: { slug: facilitySlug } },
			},
		});
		if (!event) {
			return next(
				createHttpError.InternalServerError(
					"Something went wrong. Please try again."
				)
			);
		}
		res.status(201).json(event);
	} catch (error) {
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};
