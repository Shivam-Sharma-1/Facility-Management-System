import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import { BookingInput } from "src/types/types";
import prisma from "../db/prisma";

/**
 * @description Get all approved bookings
 * @method GET
 * @access private
 * @returns {bookings[]}
 */
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
					{ status: "APPROVED_BY_GD" },
					{ status: "PENDING" },
				],
			},
			orderBy: {
				time: {
					start: "desc",
				},
			},
			select: {
				id: true,
				title: true,
				slug: true,
				purpose: true,
				status: true,
				createdAt: true,
				statusUpdateAtGD: true,
				statusUpdateAtFM: true,
				statusUpdateAtAdmin: true,
				statusUpdateByGD: {
					select: {
						user: {
							select: {
								name: true,
								employeeId: true,
							},
						},
					},
				},
				statusUpdateByFM: {
					select: {
						user: {
							select: {
								name: true,
								employeeId: true,
							},
						},
					},
				},
				time: {
					select: {
						start: true,
						end: true,
						date: true,
					},
				},
				requestedBy: {
					select: {
						name: true,
						employeeId: true,
					},
				},
				facility: {
					select: {
						name: true,
						slug: true,
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
	} finally {
		prisma.$disconnect();
	}
};

/**
 * @description Book a slot
 * @method POST
 * @access private
 * @returns {booking}
 */
export const addBookings: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { title, slug, purpose, date, start, end }: BookingInput =
			req.body;
		const facilitySlug = req.params.slug;
		const employeeId = req.session.userId;
		const user = await prisma.user.findUnique({
			where: {
				employeeId,
			},
			select: {
				groupId: true,
			},
		});
		const event = await prisma.booking.create({
			data: {
				title,
				slug,
				purpose,
				requestedBy: { connect: { employeeId } },
				facility: { connect: { slug: facilitySlug } },
				time: {
					create: {
						date,
						start,
						end,
					},
				},
				group: {
					connect: {
						id: user?.groupId!,
					},
				},
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
		console.error(error);
		if (error instanceof PrismaClientValidationError) {
			return next(createHttpError.BadRequest("Missing data fields."));
		}
		if (error.code === "P2002") {
			return next(
				createHttpError.Conflict(
					`Field ${error.meta.target} must be unique.`
				)
			);
		}
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	} finally {
		prisma.$disconnect();
	}
};
