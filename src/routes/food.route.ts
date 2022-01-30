import { Router } from "express";
import { isAuth } from "../middlewares/isAuth";
import {
  allFoods,
  averageCalories,
  createFood,
  dailyTotals,
  weeklyStats,
} from "../controllers/food.controller";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.get("/", isAuth, allFoods);

router.get("/report/weekly-stats", isAuth, isAdmin, weeklyStats);

router.get("/report/avg-calories", isAuth, isAdmin, averageCalories);

router.get("/daily-totals", dailyTotals);

router.post("/", isAuth, createFood);

export default router;
