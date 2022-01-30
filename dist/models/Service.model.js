"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ServiceSchema = new mongoose_1.default.Schema({
    name: {
        type: String
    },
    price: {
        type: Number,
        default: 0,
    },
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'doctor'
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("service", ServiceSchema);
//# sourceMappingURL=Service.model.js.map