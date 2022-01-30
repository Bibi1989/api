"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weeklyDate_1 = require("./weeklyDate");
const avgCalories = (foods) => {
    var _a;
    const { sevenDays } = weeklyDate_1.getWeekStartDate();
    const filteredFood = (_a = foods) === null || _a === void 0 ? void 0 : _a.filter((food) => { var _a; return new Date((_a = food) === null || _a === void 0 ? void 0 : _a.createdAt).getTime() > new Date(sevenDays).getTime(); });
    const len = filteredFood.length;
    return (filteredFood.reduce((acc, value) => { var _a; return (acc += (_a = value) === null || _a === void 0 ? void 0 : _a.calories); }, 0) / len);
};
exports.averageCaloriesWithinTheLastSevenDays = (users) => {
    var _a;
    return (_a = users) === null || _a === void 0 ? void 0 : _a.map((user) => {
        const foods = user.foods;
        return {
            name: user.name,
            avgCalories: avgCalories(foods),
        };
    });
};
//# sourceMappingURL=averageCaloriesWithinTheLastSevenDays.js.map