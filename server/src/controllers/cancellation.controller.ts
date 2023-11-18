import { ApprovalStatus, CancellationStatus, Role } from "@prisma/client";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";

/**
 * @description Request Cancellation
 * @method POST
 * @access private
 * @returns {Booking}
 */

export const requestCancellation: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { slug, remark, employeeId } = req.body;

		const user = await prisma.user.findUnique({
			where: {
				employeeId,
			},
			select: {
				role: true,
				facilityManager: {
					select: {
						facility: {
							select: {
								slug: true,
							},
						},
					},
				},
			},
		});

		const booking = await prisma.booking.findFirst({
			where: {
				slug,
			},
			include: {
				facility: {
					select: {
						slug: true,
					},
				},
			},
		});

		if (!user || !booking) {
			return next(
				createHttpError.InternalServerError(
					"Unable to request cancellation"
				)
			);
		}

		let cancelData = {};

		if (
			user?.role === Role.GROUP_DIRECTOR &&
			booking?.status !== ApprovalStatus.APPROVED_BY_FM &&
			booking?.status !== ApprovalStatus.APPROVED_BY_ADMIN
		) {
			cancelData = {
				status: ApprovalStatus.CANCELLED,
				cancelledAt: new Date().toISOString(),
				cancellationStatus: CancellationStatus.APPROVED_BY_GD,
				cancellationUpdateAtGD: new Date().toISOString(),
			};
		} else if (user?.role === Role.GROUP_DIRECTOR) {
			cancelData = {
				cancellationStatus: CancellationStatus.APPROVED_BY_GD,
				cancellationUpdateAtGD: new Date().toISOString(),
			};
		} else if (
			user?.role === Role.FACILITY_MANAGER &&
			user.facilityManager?.facility.some(
				(f) => f.slug === booking.facility.slug
			)
		) {
			cancelData = {
				status: ApprovalStatus.CANCELLED,
				cancelledAt: new Date().toISOString(),
				cancellationStatus: CancellationStatus.APPROVED_BY_FM,
				cancellationUpdateAtFM: new Date().toISOString(),
			};
		} else if (booking?.status === ApprovalStatus.PENDING) {
			cancelData = {
				status: ApprovalStatus.CANCELLED,
				cancellationStatus: CancellationStatus.CANCELLED_BY_USER,
			};
		} else {
			cancelData = {
				cancellationStatus: CancellationStatus.PENDING,
			};
		}

		const cancellationBooking = await prisma.booking.update({
			where: {
				slug,
			},
			data: {
				...cancelData,
				cancellationRequestedAt: new Date().toISOString(),
				cancellationRemark: remark,
			},
			select: {
				title: true,
				purpose: true,
				status: true,
				slug: true,
				createdAt: true,
				remark: true,
				cancellationStatus: true,
				cancellationRequestedAt: true,
				cancellationRemark: true,
				cancelledAt: true,
				time: {
					select: {
						start: true,
						end: true,
						date: true,
					},
				},
				statusUpdateAtGD: true,
				statusUpdateAtFM: true,
				groupDirectorName: true,
				facilityManagerName: true,
				statusUpdateAtAdmin: true,
				requestedBy: {
					select: {
						name: true,
						employeeId: true,
					},
				},
				facility: {
					select: {
						name: true,
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
			},
		});
		if (!cancellationBooking) {
			return next(createHttpError.NotFound("Booking not found"));
		}
		res.status(200).json(cancellationBooking);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Unable to request cancellation"
			)
		);
	}
};

/**
 * @description Get cancellation requests for Group Director
 * @method GET
 * @access private
 * @returns {Booking}
 */

export const getAllCancellationRequestsGD: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.session.userId;

		const cancellationRequests = await prisma.booking.findMany({
			where: {
				AND: [
					{
						group: {
							groupDirector: {
								user: {
									employeeId,
								},
							},
						},
					},
					{
						cancellationStatus: "PENDING",
					},
				],
			},
			select: {
				id: true,
				title: true,
				slug: true,
				purpose: true,
				status: true,
				createdAt: true,
				cancellationRequestedAt: true,
				cancellationStatus: true,
				cancellationRemark: true,
				cancellationUpdateAtGD: true,
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
		if (!cancellationRequests) {
			return next(
				createHttpError.Forbidden(
					"You do not have access to this resource"
				)
			);
		}
		res.status(200).json(cancellationRequests);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Unable to fetch cancellation requests"
			)
		);
	}
};

/**
 * @description Get cancellation requests for Facility Manager
 * @method GET
 * @access private
 * @returns {Booking}
 */

export const getAllCancellationRequestsFM: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.session.userId;

		let count = null;
		const user = await prisma.user.findUnique({
			where: {
				employeeId,
			},
		});

		if (!user) {
			return next(createHttpError.NotFound("User does not exist."));
		}
		count = await prisma.booking.count({
			where: {
				AND: [
					{
						facility: {
							facilityManager: {
								userId: user.id,
							},
						},
					},
					{
						AND: [
							{
								cancellationStatus:
									CancellationStatus.APPROVED_BY_GD,
							},
							{
								OR: [
									{
										status: ApprovalStatus.APPROVED_BY_ADMIN,
									},
									{
										status: ApprovalStatus.APPROVED_BY_FM,
									},
								],
							},
						],
					},
				],
			},
		});

		const cancellationRequests = await prisma.facilityManager.findFirst({
			where: {
				user: {
					employeeId,
				},
			},
			select: {
				facility: {
					select: {
						bookings: {
							where: {
								AND: [
									{
										cancellationStatus:
											CancellationStatus.APPROVED_BY_GD,
									},
									{
										OR: [
											{
												status: ApprovalStatus.APPROVED_BY_ADMIN,
											},
											{
												status: ApprovalStatus.APPROVED_BY_FM,
											},
										],
									},
								],
							},
							select: {
								id: true,
								slug: true,
								title: true,
								purpose: true,
								status: true,
								createdAt: true,
								cancellationRemark: true,
								cancellationRequestedAt: true,
								cancellationStatus: true,
								cancellationUpdateAtGD: true,
								cancellationUpdateAtFM: true,
								groupDirectorName: true,
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
							},
						},
					},
				},
			},
		});
		if (!cancellationRequests) {
			return next(
				createHttpError.Forbidden(
					"You do not have access to this resource"
				)
			);
		}
		res.status(200).json({
			count,
			facilities: cancellationRequests.facility,
		});
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Unable to fetch cancellation requests"
			)
		);
	}
};

/**
 * @description Approve cancellation request by Group Director
 * @method POST
 * @access private
 * @returns {Booking}
 */

export const approveCancellationRequestGD: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { slug, approved } = req.body;
		const status = approved
			? CancellationStatus.APPROVED_BY_GD
			: CancellationStatus.REJECTED_BY_GD;

		const bookingStatus = await prisma.booking.findUnique({
			where: {
				slug,
			},
			select: {
				status: true,
			},
		});

		const cancellationRequest = await prisma.booking.update({
			where: {
				slug,
			},
			data: {
				status:
					approved === true
						? ApprovalStatus.CANCELLED
						: bookingStatus?.status,
				cancellationStatus: status,
				cancellationUpdateAtGD: new Date().toISOString(),
			},
		});

		if (!cancellationRequest) {
			return next(
				createHttpError.NotFound("Cancellation request not found")
			);
		}

		res.status(200).json(cancellationRequest);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Unable to approve cancellation request"
			)
		);
	}
};

/**
 * @description Approve cancellation request by Facility Manager
 * @method POST
 * @access private
 * @returns {Booking}
 */

export const approveCancellationRequestFM: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { slug, approved } = req.body;
		let status = {};

		if (approved === true) {
			status = {
				cancellationStatus: CancellationStatus.APPROVED_BY_FM,
				status: ApprovalStatus.CANCELLED,
			};
		} else {
			status = {
				cancellationStatus: CancellationStatus.REJECTED_BY_FM,
			};
		}

		const cancellationRequest = await prisma.booking.update({
			where: {
				slug,
			},
			data: {
				...status,
				cancellationUpdateAtFM: new Date().toISOString(),
				cancelledAt: new Date().toISOString(),
			},
		});

		if (!cancellationRequest) {
			return next(
				createHttpError.NotFound("Cancellation request not found")
			);
		}

		res.status(200).json(cancellationRequest);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Unable to approve cancellation request"
			)
		);
	}
};

/**
 * @description Direct cancellation by Facility Manager
 * @method POST
 * @access private
 * @returns {Booking}
 */

export const directCancellation: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { slug, remark, employeeId } = req.body;

		const user = await prisma.user.findUnique({
			where: {
				employeeId,
			},
			select: {
				role: true,
			},
		});

		const booking = await prisma.booking.findFirst({
			where: {
				slug,
			},
			include: {
				facility: {
					select: {
						slug: true,
					},
				},
			},
		});

		if (!user || !booking) {
			return next(
				createHttpError.InternalServerError(
					"Unable to request cancellation"
				)
			);
		}

		const cancelledBooking = await prisma.booking.update({
			where: {
				slug,
			},
			data: {
				status: ApprovalStatus.CANCELLED,
				cancelledAt: new Date().toISOString(),
				cancellationStatus: CancellationStatus.CANCELLED_BY_FM,
				cancellationUpdateAtFM: new Date().toISOString(),
				cancellationRemark: remark,
			},
		});
		res.status(200).json(cancelledBooking);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Unable to request cancellation"
			)
		);
	}
};
