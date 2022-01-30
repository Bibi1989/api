import { Request } from "express";
import { UserI } from "../controllers/user.controller";

export interface RequestI extends Request {
  user: UserI | any;
}
