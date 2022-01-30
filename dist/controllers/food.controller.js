"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Food_model_1 = __importDefault(require("../models/Food.model"));
const messageStatus_1 = require("../utils/messageStatus");
const messageStatus_2 = require("../utils/messageStatus");
const weeklyDate_1 = require("../utils/weeklyDate");
const User_model_1 = __importDefault(require("../models/User.model"));
const averageCaloriesWithinTheLastSevenDays_1 = require("../utils/averageCaloriesWithinTheLastSevenDays");
exports.allFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const page = (_a = req.query.page, (_a !== null && _a !== void 0 ? _a : 1));
        const limit = (_b = req.query.limit, (_b !== null && _b !== void 0 ? _b : 10));
        const skip = (page - 1) * limit;
        const bothQuerys = {
            createdAt: { $gte: startDate, $lte: endDate },
        };
        const justStartQuery = {
            createdAt: { $gte: startDate },
        };
        const finalQuery = startDate && endDate ? bothQuerys : startDate ? justStartQuery : {};
        const foods = yield Food_model_1.default.find(finalQuery)
            .populate("user")
            .limit(limit)
            .skip(skip);
        messageStatus_1.successMessage(res, { foods, page, limit });
    }
    catch (error) {
        messageStatus_2.errorMessage(res, error, 400);
    }
});
exports.weeklyStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sevenDays, fourteenDays } = weeklyDate_1.getWeekStartDate();
        const queryForSevenDays = {
            createdAt: { $gte: sevenDays },
        };
        const queryForFourteenDays = {
            createdAt: { $gte: fourteenDays, $lt: sevenDays },
        };
        const addedEntriesForSevenDays = yield Food_model_1.default.find(queryForSevenDays).countDocuments();
        const addedEntriesForFourteenDays = yield Food_model_1.default.find(queryForFourteenDays).countDocuments();
        messageStatus_1.successMessage(res, {
            addedEntriesForSevenDays,
            addedEntriesForFourteenDays,
        });
    }
    catch (error) {
        messageStatus_2.errorMessage(res, error, 400);
    }
});
exports.averageCalories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_model_1.default.find({}).populate("foods");
        const averageCaloriesCal = averageCaloriesWithinTheLastSevenDays_1.averageCaloriesWithinTheLastSevenDays(users);
        messageStatus_1.successMessage(res, averageCaloriesCal);
    }
    catch (error) {
        messageStatus_2.errorMessage(res, error, 400);
    }
});
exports.dailyTotals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        let date = (_c = req.query.date, (_c !== null && _c !== void 0 ? _c : new Date().toISOString()));
        date = new Date();
        const oneDay = new Date(date.setDate(new Date().getDate() - 1)).toISOString();
        const query = {
            dateTime: { $gte: date },
        };
        const foods = yield Food_model_1.default.find({}).populate("user");
        const total = foods.reduce((acc, val) => { var _a; return (acc += (_a = val) === null || _a === void 0 ? void 0 : _a.calories); }, 0);
        messageStatus_1.successMessage(res, { total, oneDay });
    }
    catch (error) {
        messageStatus_2.errorMessage(res, error, 400);
    }
});
exports.createFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        const user = req.user;
        const food = new Food_model_1.default(Object.assign(Object.assign({}, req.body), { userId: (_d = user) === null || _d === void 0 ? void 0 : _d._id }));
        yield food.save();
        const userData = yield User_model_1.default.findOne({ email: (_e = user) === null || _e === void 0 ? void 0 : _e.email });
        userData.foods.push(food);
        yield userData.save();
        messageStatus_1.successMessage(res, food);
    }
    catch (error) {
        messageStatus_2.errorMessage(res, error, 400);
    }
});
//# sourceMappingURL=food.controller.js.map