import { ApprovalStatus, CancellationStatus } from "@prisma/client";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";

declare module "express-session" {
	export interface SessionData {
		userId: number;
	}
}

/**
 * @description Get all facilities
 * @method GET
 * @access private
 * @returns [{name, employeeId, role}, [facilities]]
 */
export const getFacilities: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const facilities = await prisma.facility.findMany({
			where: {
				isActive: true,
			},
			include: {
				facilityManager: {
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
		if (!facilities) {
			return next(
				createHttpError.NotFound(
					"Something went wrong. Please try again."
				)
			);
		}
		res.status(200).json({ facilities });
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
 * @description Get count of pending approvals and cancellations
 * @method GET
 * @access private
 * @returns {approvalCount, cancellationCount}
 */

export const getCount: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let count = {};
		const employeeId = parseInt(req.params.employeeId);
		const user = await prisma.user.findUnique({
			where: {
				employeeId,
			},
		});

		if (!user) {
			return next(createHttpError.NotFound("User does not exist."));
		}

		if (user?.role === "GROUP_DIRECTOR") {
			const approvalCount = await prisma.booking.count({
				where: {
					AND: [
						{
							groupId: user.groupId!,
						},
						{
							status: "PENDING",
						},
					],
				},
			});
			const cancellationCount = await prisma.booking.count({
				where: {
					AND: [
						{
							groupId: user.groupId!,
						},
						{
							cancellationStatus: CancellationStatus.PENDING,
						},
					],
				},
			});

			count = {
				approvalCount,
				cancellationCount,
			};
		}

		if (user?.role === "FACILITY_MANAGER") {
			const facility = await prisma.facilityManager.findUnique({
				where: {
					userId: user.id,
				},
				select: {
					facilityId: true,
				},
			});

			const approvalCount = await prisma.booking.count({
				where: {
					AND: [
						{
							facilityId: facility?.facilityId,
						},
						{
							status: "APPROVED_BY_GD",
						},
					],
				},
			});
			const cancellationCount = await prisma.booking.count({
				where: {
					AND: [
						{
							facilityId: facility?.facilityId,
						},
						{
							AND: [
								{
									cancellationStatus:
										CancellationStatus.APPROVED_BY_GD,
								},
								{
									status:
										ApprovalStatus.APPROVED_BY_ADMIN ||
										ApprovalStatus.APPROVED_BY_FM,
								},
							],
						},
					],
				},
			});

			count = {
				approvalCount: approvalCount || 0,
				cancellationCount,
			};
		}

		res.status(200).json(count);
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
 * @description Get employee details
 * @method GET
 * @access public
 * @returns {name, employeeId, role}
 */

export const getEmployeeDetails: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = parseInt(req.params.employeeId);

		const user = await prisma.user.findUnique({
			where: {
				employeeId,
			},
			select: {
				name: true,
				employeeId: true,
				role: true,
				image: true,
			},
		});

		if (!user) {
			return next(createHttpError.NotFound("User does not exist."));
		}

		req.session.userId = user.employeeId;
		res.status(200).json(user);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Please try again."
			)
		);
	}
};
