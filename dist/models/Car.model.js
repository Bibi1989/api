"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CarSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Name is a required field"],
    },
    model: {
        type: String,
        required: [true, "Model is a required field"],
    },
    description: String,
    price: {
        type: String,
        required: [true, "Price is a required field"],
    },
    distance: String,
    fuel_type: {
        type: String,
        required: [true, "Fuel Type is a required field"],
    },
    photo_url: String,
    color: String,
    year: String,
    location: {
        type: String,
        required: [true, "Location is a required field"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
exports.default = mongoose_1.default.model("cars", CarSchema);
//# sourceMappingURL=Car.model.js.map