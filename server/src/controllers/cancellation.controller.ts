import { ApprovalStatus, CancellationStatus, Role } from "@prisma/client";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";

export const requestCancellation: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { slug, remark, employeeId } = req.body;

		console.log({ employeeId, slug, remark });

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

		let candelData = {};

		if (
			user?.role === Role.GROUP_DIRECTOR &&
			booking?.status !== ApprovalStatus.APPROVED_BY_FM &&
			booking?.status !== ApprovalStatus.APPROVED_BY_ADMIN
		) {
			candelData = {
				status: ApprovalStatus.CANCELLED,
				cancelledAt: new Date().toISOString(),
				cancellationStatus: CancellationStatus.APPROVED_BY_GD,
				cancellationUpdateAtGD: new Date().toISOString(),
			};
		} else if (user?.role === Role.GROUP_DIRECTOR) {
			candelData = {
				cancellationStatus: CancellationStatus.APPROVED_BY_GD,
				cancellationUpdateAtGD: new Date().toISOString(),
			};
		} else if (
			user?.role === Role.FACILITY_MANAGER &&
			user.facilityManager?.facility.slug === booking?.facility.slug
		) {
			//commented by me
			console.log({
				user: user.role,
				slug:
					user.facilityManager?.facility.slug ===
					booking?.facility.slug,
			});

			candelData = {
				status: ApprovalStatus.CANCELLED,
				cancelledAt: new Date().toISOString(),
				cancellationStatus: CancellationStatus.APPROVED_BY_FM,
				cancellationUpdateAtFM: new Date().toISOString(),
			};
		} else if (booking?.status === ApprovalStatus.PENDING) {
			candelData = {
				cancellationStatus: CancellationStatus.CANCELLED_BY_USER,
			};
		} else {
			candelData = {
				cancellationStatus: CancellationStatus.PENDING,
			};
		}

		const cancellationBooking = await prisma.booking.update({
			where: {
				slug,
			},
			data: {
				...candelData,
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

export const getAllCancellationRequestsFM: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = req.session.userId;
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
								cancellationStatus: "APPROVED_BY_GD",
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
		res.status(200).json(cancellationRequests.facility.bookings);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Unable to fetch cancellation requests"
			)
		);
	}
};

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

		const cancellationRequest = await prisma.booking.update({
			where: {
				slug,
			},
			data: {
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

export const approveCancellationRequestFM: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { slug, approved } = req.body;
		const status = approved
			? CancellationStatus.APPROVED_BY_FM
			: CancellationStatus.REJECTED_BY_FM;

		const cancellationRequest = await prisma.booking.update({
			where: {
				slug,
			},
			data: {
				cancellationStatus: status,
				cancellationUpdateAtFM: new Date().toISOString(),
				status: "CANCELLED",
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
