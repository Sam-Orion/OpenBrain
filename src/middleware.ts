import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({
      message: "You are not logged in",
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(403).json({
      message: "You are not logged in",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_PASSWORD) as JwtPayload;
    (req as Request & { userId?: string }).userId = String(decoded.id);
    return next();
  } catch {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
  //   const decoded = jwt.verify(header as string, JWT_PASSWORD);
  //   if (decoded) {
  //     //@ts-ignore
  //     req.userId = decoded.id;
  //     next();
  //   } else {
  //     res.status(403).json({
  //       message: "You are not logged in",
  //     });
  //   }
};
