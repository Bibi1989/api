"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuth_1 = require("../middlewares/isAuth");
const food_controller_1 = require("../controllers/food.controller");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.Router();
router.get("/", isAuth_1.isAuth, food_controller_1.allFoods);
router.get("/report/weekly-stats", isAuth_1.isAuth, isAdmin_1.isAdmin, food_controller_1.weeklyStats);
router.get("/report/avg-calories", isAuth_1.isAuth, isAdmin_1.isAdmin, food_controller_1.averageCalories);
router.get("/daily-totals", food_controller_1.dailyTotals);
router.post("/", isAuth_1.isAuth, food_controller_1.createFood);
exports.default = router;
//# sourceMappingURL=food.route.js.map