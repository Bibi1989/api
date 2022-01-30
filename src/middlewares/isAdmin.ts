import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RequestI } from "../utils/types";
import { errorMessage } from "../utils/messageStatus";
import UserModel from "../models/User.model";
import _ from "lodash";

export const isAdmin = async (
  req: RequestI,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenReq: any = req.headers["authorization"];
    const bearer = tokenReq?.split(" ")[0];
    const token = tokenReq?.split(" ")[1];
    if (token) {
      if (bearer !== "Bearer") {
        errorMessage(res, "Add bearer", 401);
      } else {
        const decoded: any = await jwt.verify(token, process.env.SECRET_KEY);
        console.log("tokenReq === ", decoded?.role);

        if (decoded?.role !== "admin")
          return errorMessage(res, "Your not not an admin", 401);
        next();
      }
    } else {
      errorMessage(res, "Token is not provided", 401);
    }
  } catch (error) {
    errorMessage(res, "This endpoint is not authorized", 401);
  }
};
