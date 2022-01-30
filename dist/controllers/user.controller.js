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
const User_model_1 = __importDefault(require("../models/User.model"));
const hashPassword_1 = require("../utils/hashPassword");
const generateToken_1 = require("../utils/generateToken");
const logErrors = (values) => {
    const errors = {
        name: null,
        email: null,
        password: null,
    };
    if (!values.name) {
        errors.name = "Name is empty";
    }
    if (!values.email) {
        errors.email = "Email is empty";
    }
    if (!values.password) {
        errors.password = "sex is empty";
    }
    return values.name && values.email && values.password
        ? { values, error: "" }
        : { values: "", error: errors };
};
exports.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { values, error } = logErrors(req.body);
        const role = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.role, (_b !== null && _b !== void 0 ? _b : "user"));
        if (!values) {
            return messageStatus_1.errorMessage(res, error, 404);
        }
        const findEmail = yield User_model_1.default.find({ email: values.email });
        if (((_c = findEmail) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            return messageStatus_1.errorMessage(res, "Email has been register already", 404);
        }
        const hashedPassword = yield hashPassword_1.hashPassword(req.body.password);
        const user = new User_model_1.default(Object.assign(Object.assign({}, values), { password: hashedPassword }));
        yield user.save();
        const token = yield generateToken_1.generateToken(Object.assign(Object.assign({}, user._doc), { role }));
        messageStatus_1.successMessage(res, Object.assign(Object.assign({}, user._doc), { token }));
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.signinUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    try {
        const isEmailEmpty = lodash_1.default.isEmpty(req.body.email);
        const isPasswordEmpty = lodash_1.default.isEmpty(req.body.password);
        if (isEmailEmpty && isPasswordEmpty) {
            return messageStatus_1.errorMessage(res, "Wrong email or password", 404);
        }
        const findUser = yield User_model_1.default.findOne({ email: req.body.email });
        if (!((_d = findUser) === null || _d === void 0 ? void 0 : _d.email)) {
            return messageStatus_1.errorMessage(res, "Wrong email or password", 404);
        }
        const isValidPassword = yield hashPassword_1.comparePassword(req.body.password, (_e = findUser) === null || _e === void 0 ? void 0 : _e.password);
        if (!isValidPassword) {
            return messageStatus_1.errorMessage(res, "Invalid password", 404);
        }
        const token = yield generateToken_1.generateToken(Object.assign(Object.assign({}, findUser), { role: (_f = findUser) === null || _f === void 0 ? void 0 : _f.role }));
        messageStatus_1.successMessage(res, Object.assign(Object.assign({}, findUser._doc), { token }));
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        let user = yield User_model_1.default.findOne({ _id: userId });
        user = lodash_1.default.omitBy(user, "password");
        messageStatus_1.successMessage(res, Object.assign({}, user));
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
//# sourceMappingURL=user.controller.js.map