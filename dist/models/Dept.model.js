"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DeptSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    doctor: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "doctor"
        }],
    symptoms: []
}, { timestamps: true });
exports.default = mongoose_1.default.model("dept", DeptSchema);
//# sourceMappingURL=Dept.model.js.map