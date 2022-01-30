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
const lodash_1 = __importDefault(require("lodash"));
const messageStatus_1 = require("../utils/messageStatus");
const messageStatus_2 = require("../utils/messageStatus");
const walletValidation = (values) => {
    const errors = {
        accountNumber: "",
        amount: ""
    };
    const isAccountNumberEmpty = lodash_1.default.isEmpty(values.accountNumber);
    const isAmountEmpty = lodash_1.default.isEmpty(values.amount);
    if (isAccountNumberEmpty) {
        errors.accountNumber = "Account number is empty";
    }
    if (isAmountEmpty) {
        errors.amount = "Amount number is empty";
    }
    return isAccountNumberEmpty || isAmountEmpty ? { errors, values: null } : { values, errors: null };
};
exports.createWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { values, errors } = walletValidation(req.body);
        if (!values) {
            return messageStatus_2.errorMessage(res, errors, 404);
        }
        messageStatus_1.successMessage(res, values);
    }
    catch (error) {
    }
});
//# sourceMappingURL=wallet.controller.js.map