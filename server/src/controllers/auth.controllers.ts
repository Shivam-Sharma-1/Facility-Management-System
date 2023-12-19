import argon2 from "argon2";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";

import prisma from "../db/prisma";
import { AuthInput } from "../types/types";
import logger from "../utils/logger";
import authSchema from "../utils/validation";

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
    const { employeeId, password }: AuthInput = await authSchema.validateAsync(
      req.body
    );
    const user = await prisma.user.findUnique({
      where: {
        employeeId: parseInt(employeeId),
      },
    });
    if (!user) {
      return next(createHttpError.Unauthorized("User does not exist."));
    }
    const validPassword = await argon2.verify(user.password!, password);

    if (!validPassword) {
      return next(createHttpError.Unauthorized("Invalid credentials."));
    }
    req.session.userId = user.employeeId;

    res.status(200).json({
      name: user.name,
      employeeId: user.employeeId,
      image: user.image,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    logger.error(error);
    if (error.isJoi === true) {
      return next(
        createHttpError.BadRequest(`Invalid ${error.details[0].path}`)
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
  req.sessionStore.destroy(req.sessionID, (err) => {
    if (err) {
      logger.error(err);
      console.error("Error destroying session in store:", err);
    } else {
      req.session.destroy((error) => {
        if (error) {
          logger.error(error);
          console.error("Error destroying session:", error);
        }
      });
    }
  });
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
    const userId = req.session.userId;

    const user = await prisma.user.findUnique({
      where: {
        employeeId: userId,
      },
    });
    if (!user) {
      return next(createHttpError.Unauthorized("User does not exist."));
    }
    const verifyOldPassword = await argon2.verify(user.password!, oldPassword);
    if (!verifyOldPassword) {
      return next(createHttpError.BadRequest("Invalid old password."));
    }
    const hashedPassword = await argon2.hash(newPassword);
    await prisma.user.update({
      where: {
        employeeId: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.session.deleteMany({
      where: {
        data: {
          contains: `"userId":${userId}`,
        },
      },
    });
  } catch (error) {
    console.error(error);
    logger.error(error);
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
    const { image, name, employeeId, password, role }: AuthInput = req.body;
    const userExists = await prisma.user.findUnique({
      where: {
        employeeId: parseInt(employeeId),
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
        employeeId: parseInt(employeeId),
        password: hashedPassword,
        role: role,
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    logger.error(error);
    console.error(error);
    if (error.isJoi === true)
      return next(createHttpError.BadRequest(error.message));
    next(error);
  }
};
