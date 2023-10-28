import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
	next(createHttpError.NotFound("Page does not exist"));
};
