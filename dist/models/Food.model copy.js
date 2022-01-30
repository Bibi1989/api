"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FoodSchema = new mongoose_1.default.Schema({
    food: {
        type: String,
    },
    price: {
        type: Number,
        default: 0,
    },
    calories: {
        type: Number,
    },
    dateTime: {
        type: String,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("food", FoodSchema);
//# sourceMappingURL=Food.model copy.js.map