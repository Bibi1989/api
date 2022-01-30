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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const messageStatus_1 = require("../utils/messageStatus");
const User_model_1 = __importDefault(require("../models/User.model"));
const lodash_1 = __importDefault(require("lodash"));
exports.isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const tokenReq = req.headers["authorization"];
        const bearer = (_a = tokenReq) === null || _a === void 0 ? void 0 : _a.split(" ")[0];
        const token = (_b = tokenReq) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
        if (token) {
            if (bearer !== "Bearer") {
                messageStatus_1.errorMessage(res, "Add bearer", 401);
            }
            else {
                const decoded = yield jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                const findUser = yield User_model_1.default.findOne({ email: (_c = decoded) === null || _c === void 0 ? void 0 : _c.email });
                console.log(token);
                if (lodash_1.default.isEmpty(findUser))
                    return messageStatus_1.errorMessage(res, "Your not authorized", 401);
                req.user = decoded;
                next();
            }
        }
        else {
            messageStatus_1.errorMessage(res, "Token is not provided", 401);
        }
    }
    catch (error) {
        messageStatus_1.errorMessage(res, "This endpoint is not authorized", 401);
    }
});
//# sourceMappingURL=isAuth.js.map