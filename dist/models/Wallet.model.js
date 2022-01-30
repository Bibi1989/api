"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const WalletSchema = new mongoose_1.default.Schema({
    accountNumber: {
        type: String
    },
    amount: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("wallet", WalletSchema);
//# sourceMappingURL=Wallet.model.js.map