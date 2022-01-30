"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FoodSchema = new mongoose_1.default.Schema({
    food: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    calories: {
        type: Number,
        required: true,
    },
    dateTime: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("food", FoodSchema);
//# sourceMappingURL=Food.model.js.map