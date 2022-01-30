import { Request, Response } from "express";
import _ from "lodash";

import { errorMessage, successMessage } from "../utils/messageStatus";
import UserModel from "../models/User.model";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import { RequestI } from "../utils/types";

export interface UserI {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  foods?: any;
}

const logErrors: any = (values: UserI) => {
  const errors: UserI = {
    name: null,
    email: null,
    password: null,
  };

  if (!values.name) {
    errors.name = "Name is empty";
  }
  if (!values.email) {
    errors.email = "Email is empty";
  }
  if (!values.password) {
    errors.password = "sex is empty";
  }

  return values.name && values.email && values.password
    ? { values, error: "" }
    : { values: "", error: errors };
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { values, error } = logErrors(req.body);

    const role = req.body?.role ?? "user";

    if (!values) {
      return errorMessage(res, error, 404);
    }

    const findEmail = await UserModel.find({ email: values.email });

    if (findEmail?.length > 0) {
      return errorMessage(res, "Email has been register already", 404);
    }

    const hashedPassword = await hashPassword(req.body.password);

    const user: any = new UserModel({
      ...values,
      password: hashedPassword,
    });

    await user.save();

    const token = await generateToken({ ...user._doc, role });

    successMessage(res, { ...user._doc, token });
  } catch (error) {
    return errorMessage(res, error.message, 400);
  }
};

export const signinUser = async (req: Request, res: Response) => {
  try {
    const isEmailEmpty = _.isEmpty(req.body.email);
    const isPasswordEmpty = _.isEmpty(req.body.password);

    if (isEmailEmpty && isPasswordEmpty) {
      return errorMessage(res, "Wrong email or password", 404);
    }

    const findUser: any = await UserModel.findOne({ email: req.body.email });

    if (!findUser?.email) {
      return errorMessage(res, "Wrong email or password", 404);
    }

    const isValidPassword = await comparePassword(
      req.body.password,
      findUser?.password
    );

    if (!isValidPassword) {
      return errorMessage(res, "Invalid password", 404);
    }

    const token = await generateToken({ ...findUser, role: findUser?.role });

    successMessage(res, { ...findUser._doc, token });
  } catch (error) {
    return errorMessage(res, error.message, 400);
  }
};

export const me = async (req: RequestI, res: Response) => {
  try {
    const userId = req.user;

    let user: any = await UserModel.findOne({ _id: userId });

    user = _.omitBy(user, "password");

    successMessage(res, { ...user });
  } catch (error) {
    return errorMessage(res, error.message, 400);
  }
};
