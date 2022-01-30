import { Request, Response } from "express";
import _ from "lodash";
import { RequestI } from "../utils/types";
import FoodModel from "../models/Food.model";
import { successMessage } from "../utils/messageStatus";
import { errorMessage } from "../utils/messageStatus";
import { getWeekStartDate } from "../utils/weeklyDate";
import UserModel from "../models/User.model";
import { averageCaloriesWithinTheLastSevenDays } from "../utils/averageCaloriesWithinTheLastSevenDays";

export const allFoods = async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 10;

    const skip = (page - 1) * limit;

    const bothQuerys = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    const justStartQuery = {
      createdAt: { $gte: startDate },
    };

    const finalQuery =
      startDate && endDate ? bothQuerys : startDate ? justStartQuery : {};

    const foods = await FoodModel.find(finalQuery)
      .populate("user")
      .limit(limit)
      .skip(skip);

    successMessage(res, { foods, page, limit });
  } catch (error) {
    errorMessage(res, error, 400);
  }
};

export const weeklyStats = async (_req: Request, res: Response) => {
  try {
    const { sevenDays, fourteenDays } = getWeekStartDate();
    const queryForSevenDays = {
      createdAt: { $gte: sevenDays },
    };
    const queryForFourteenDays = {
      createdAt: { $gte: fourteenDays, $lt: sevenDays },
    };

    const addedEntriesForSevenDays = await FoodModel.find(
      queryForSevenDays
    ).countDocuments();

    const addedEntriesForFourteenDays = await FoodModel.find(
      queryForFourteenDays
    ).countDocuments();

    successMessage(res, {
      addedEntriesForSevenDays,
      addedEntriesForFourteenDays,
    });
  } catch (error) {
    errorMessage(res, error, 400);
  }
};

export const averageCalories = async (req: Request, res: Response) => {
  try {
    const users: any = await UserModel.find({}).populate("foods");

    const averageCaloriesCal = averageCaloriesWithinTheLastSevenDays(users);

    successMessage(res, averageCaloriesCal);
  } catch (error) {
    errorMessage(res, error, 400);
  }
};

export const dailyTotals = async (req: Request, res: Response) => {
  try {
    let date = req.query.date ?? new Date().toISOString();

    date = new Date();

    const oneDay = new Date(
      date.setDate(new Date().getDate() - 1)
    ).toISOString();

    const query = {
      dateTime: { $gte: date },
    };

    const foods: any = await FoodModel.find({}).populate("user");

    const total = foods.reduce(
      (acc: number, val: any) => (acc += val?.calories),
      0
    );

    successMessage(res, { total, oneDay });
  } catch (error) {
    errorMessage(res, error, 400);
  }
};

export const createFood = async (req: RequestI, res: Response) => {
  try {
    const user = req.user;
    const food = new FoodModel({
      ...req.body,
      userId: user?._id,
    });

    await food.save();

    const userData: any = await UserModel.findOne({ email: user?.email });

    userData.foods.push(food);

    await userData.save();

    successMessage(res, food);
  } catch (error) {
    errorMessage(res, error, 400);
  }
};
