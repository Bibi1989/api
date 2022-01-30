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
const Patient_model_1 = __importDefault(require("../models/Patient.model"));
const hashPassword_1 = require("../utils/hashPassword");
const generateToken_1 = require("../utils/generateToken");
const uuidv4_1 = require("uuidv4");
const Wallet_model_1 = __importDefault(require("../models/Wallet.model"));
const logErrors = (values) => {
    const errors = {
        name: null,
        age: null,
        sex: null,
        phone: null,
        address: null,
        password: null,
    };
    if (!values.name) {
        errors.name = "Name is empty";
    }
    if (!values.age) {
        errors.age = "age is empty";
    }
    if (!values.sex) {
        errors.sex = "sex is empty";
    }
    if (!values.phone) {
        errors.phone = "phone is empty";
    }
    if (!values.address) {
        errors.address = "address is empty";
    }
    if (!values.password) {
        errors.password = "password is empty";
    }
    return values.name && values.age && values.sex && values.phone && values.address && values.password ? { values, error: "" } : { values: "", error: errors };
};
exports.createPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { values, error } = logErrors(req.body);
        const accountNumber = `medi-${uuidv4_1.uuid()}`;
        if (!values) {
            return messageStatus_1.errorMessage(res, error, 404);
        }
        const findEmail = yield Patient_model_1.default.find({ email: values.email });
        if (((_a = findEmail) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return messageStatus_1.errorMessage(res, "Email has been register already", 404);
        }
        const hashedPassword = yield hashPassword_1.hashPassword(req.body.password);
        const patient = new Patient_model_1.default(Object.assign(Object.assign({}, values), { password: hashedPassword }));
        yield patient.save();
        const wallet = new Wallet_model_1.default({ accountNumber, user: patient._id });
        yield wallet.save();
        yield Patient_model_1.default.findByIdAndUpdate((_b = patient) === null || _b === void 0 ? void 0 : _b._id, { wallet: (_c = wallet) === null || _c === void 0 ? void 0 : _c._id });
        const token = yield generateToken_1.generateToken(patient);
        messageStatus_1.successMessage(res, Object.assign(Object.assign({}, patient._doc), { token, wallet }));
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.signinPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        const isEmailEmpty = lodash_1.default.isEmpty(req.body.email);
        const isPasswordEmpty = lodash_1.default.isEmpty(req.body.password);
        if (isEmailEmpty && isPasswordEmpty) {
            return messageStatus_1.errorMessage(res, "Email or password is empty", 404);
        }
        const findUser = yield Patient_model_1.default.findOne({ email: req.body.email });
        if (!((_d = findUser) === null || _d === void 0 ? void 0 : _d.email)) {
            return messageStatus_1.errorMessage(res, "You have not register yet", 404);
        }
        const isValidPassword = yield hashPassword_1.comparePassword(req.body.password, (_e = findUser) === null || _e === void 0 ? void 0 : _e.password);
        if (!isValidPassword) {
            return messageStatus_1.errorMessage(res, "Invalid password", 404);
        }
        const token = yield generateToken_1.generateToken(findUser);
        messageStatus_1.successMessage(res, Object.assign(Object.assign({}, findUser._doc), { token }));
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
// export const assignPatientToDoctor = async (req: Request, res: Response) => {
//   try {
//     const doctorId = req.query.doctorId
//     const patientId = req.query.patientId
//     const findPatient = await PatientModel.findById(patientId)
//     const isPatientFound = _.isEmpty(findPatient)
//     if(isPatientFound) {
//       return errorMessage(res, "Not found!!!", 404)
//     }
//     const patient = await PatientModel.findByIdAndUpdate(patientId, {doctor: doctorId}, {new: true})
//     successMessage(res, patient)
//   } catch (error) {
//     return errorMessage(res, error.message, 400)
//   }
// }
// export const assignPatientToRoom = async (req: Request, res: Response) => {
//   try {
//     const roomId = req.query.roomId
//     const patientId = req.query.patientId
//     const findPatient = await PatientModel.findById(patientId)
//     const isPatientFound = _.isEmpty(findPatient)
//     if(isPatientFound) {
//       return errorMessage(res, "Not found!!!", 404)
//     }
//     const patient = await PatientModel.findByIdAndUpdate(patientId, {room: roomId}, {new: true})
//     successMessage(res, patient)
//   } catch (error) {
//     return errorMessage(res, error.message, 400)
//   }
// }
exports.getAllPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield Patient_model_1.default.find({}).populate({
            path: 'doctor',
            select: {
                patients: 0
            }
        }).populate({
            path: 'room',
            select: {
                patients: 0
            }
        });
        messageStatus_1.successMessage(res, patients);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.getPatientProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patient = yield Patient_model_1.default.findById(req.params.patientId).populate("wallet");
        console.log("patient == ", patient);
        messageStatus_1.successMessage(res, patient);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
//# sourceMappingURL=patient.controller.js.map