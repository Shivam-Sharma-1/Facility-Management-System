import cors from "cors";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { corsOptions } from "src/app";

const validateSession = (req: Request, res: Response, next: NextFunction) => {
  cors(corsOptions)(req, res, () => {
    if (!req.session.userId) {
      return next(createHttpError.Unauthorized("Please login and try again"));
    } else {
      return next();
    }
  });
};

export default validateSession;
