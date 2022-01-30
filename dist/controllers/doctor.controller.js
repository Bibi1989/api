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
const cloudinary_1 = require("cloudinary");
const lodash_1 = __importDefault(require("lodash"));
const uuidv4_1 = require("uuidv4");
const Doctor_model_1 = __importDefault(require("../models/Doctor.model"));
const Patient_model_1 = __importDefault(require("../models/Patient.model"));
const messageStatus_1 = require("../utils/messageStatus");
const Wallet_model_1 = __importDefault(require("../models/Wallet.model"));
const hashPassword_1 = require("../utils/hashPassword");
const generateToken_1 = require("../utils/generateToken");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const logErrors = (values) => {
    const errors = {
        name: null,
        deptName: null,
        specialization: null,
        phone: null,
        location: null,
    };
    if (!values.name) {
        errors.name = "Name is empty";
    }
    if (!values.deptName) {
        errors.deptName = "deptName is empty";
    }
    if (!values.specialization) {
        errors.specialization = "specialization is empty";
    }
    if (!values.phone) {
        errors.phone = "phone is empty";
    }
    if (!values.location) {
        errors.location = "location is empty";
    }
    return values.name && values.deptName && values.specialization && values.phone && values.location ? { values, error: "" } : { values: "", error: errors };
};
const userFieldValidation = (values) => {
    const errors = {
        name: null,
        email: null,
        phone: null,
        address: null,
        password: null
    };
    if (!values.name) {
        errors.name = "Name is empty";
    }
    if (!values.email) {
        errors.email = "email is empty";
    }
    if (!values.address) {
        errors.address = "address is empty";
    }
    if (!values.phone) {
        errors.phone = "phone is empty";
    }
    if (!values.password) {
        errors.password = "password is empty";
    }
    return values.name && values.email && values.password && values.phone && values.address ? { values, error: "" } : { values: "", error: errors };
};
exports.createDoctorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { values, error } = logErrors(req.body);
        if (!values) {
            return res.status(404).json({ status: 'error', error });
        }
        const accountNumber = `medi-${uuidv4_1.uuid()}`;
        const hashedPassword = yield hashPassword_1.hashPassword(req.body.password);
        const doctor = new Doctor_model_1.default(Object.assign(Object.assign({}, values), { name: (_a = values.name) === null || _a === void 0 ? void 0 : _a.toLowerCase(), password: hashedPassword }));
        yield doctor.save();
        const wallet = new Wallet_model_1.default({ accountNumber, user: doctor._id });
        yield wallet.save();
        yield Doctor_model_1.default.findByIdAndUpdate(doctor._id, { wallet: wallet._id }, { new: true });
        const token = yield generateToken_1.generateToken(doctor);
        res.json({ status: 'success', data: doctor, wallet, token });
    }
    catch (error) {
        // res.status(500).json({status: 'error', error: error.code === 11000 ? "A field is unique" : "An error occured"})
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.signinDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const isEmailEmpty = lodash_1.default.isEmpty(req.body.email);
        const isPasswordEmpty = lodash_1.default.isEmpty(req.body.password);
        if (isEmailEmpty && isPasswordEmpty) {
            return messageStatus_1.errorMessage(res, "Email or password is empty", 404);
        }
        const findUser = yield Doctor_model_1.default.findOne({ email: req.body.email });
        if (!((_b = findUser) === null || _b === void 0 ? void 0 : _b.email)) {
            return messageStatus_1.errorMessage(res, "You have not register yet", 404);
        }
        const isValidPassword = yield hashPassword_1.comparePassword(req.body.password, (_c = findUser) === null || _c === void 0 ? void 0 : _c.password);
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
exports.getDoctotorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = yield (yield Doctor_model_1.default.findById(req.params.doctorId).populate('dept')).populate('wallet').populate('patients');
        messageStatus_1.successMessage(res, doctor);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.assignDoctorToPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        const doctorId = req.query.doctorId;
        const patientId = req.query.patientId;
        const findDoctor = yield Doctor_model_1.default.findById(doctorId);
        const isDoctorFound = lodash_1.default.isEmpty(findDoctor);
        if (isDoctorFound) {
            return messageStatus_1.errorMessage(res, "Not found!!!", 404);
        }
        let patientArray = (_e = (_d = findDoctor) === null || _d === void 0 ? void 0 : _d.patients) === null || _e === void 0 ? void 0 : _e.concat(patientId);
        patientArray = lodash_1.default.uniqBy(patientArray, (id) => JSON.stringify(id));
        const patient = yield Doctor_model_1.default.findByIdAndUpdate(doctorId, { patients: patientArray }, { new: true });
        yield Patient_model_1.default.findByIdAndUpdate(patientId, { doctor: doctorId }, { new: true });
        messageStatus_1.successMessage(res, patient);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.updateDoctorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h, _j;
    try {
        const { values, error } = logErrors(req.body);
        const doctorId = req.params.doctorId;
        // if(!values) {
        //   return res.status(404).json({status: 'error', error})
        // }
        const foundDoctor = yield Doctor_model_1.default.findById(doctorId);
        const doctorsName = yield Doctor_model_1.default.find({ name: (_f = values) === null || _f === void 0 ? void 0 : _f.name });
        const isMyName = ((_g = doctorsName) === null || _g === void 0 ? void 0 : _g.name) === ((_h = values) === null || _h === void 0 ? void 0 : _h.name);
        const isFound = ((_j = foundDoctor) === null || _j === void 0 ? void 0 : _j.name) ? true : false;
        if (!isFound) {
            return res.status(404).json({ status: 'error', error: "Wrong or invalid doctor ID" });
        }
        if (doctorsName.length > 0 && !isMyName && !isFound) {
            return res.status(404).json({ status: 'error', error: "This name is used already, use another name" });
        }
        const doctor = yield Doctor_model_1.default.findByIdAndUpdate(doctorId, req.body, { new: true });
        res.json({ status: 'success', data: doctor });
    }
    catch (error) {
        // res.status(500).json({status: 'error', error: error.code === 11000 ? "A field is unique" : "An error occured"})
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.getAllDoctors = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield Doctor_model_1.default.find({}).populate({
            path: 'dept',
            select: {
                doctor: 0,
                doctors: 0
            }
        }).populate('patients').populate('wallet');
        messageStatus_1.successMessage(res, doctors);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.getAllDoctorsByDept = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k, _l;
    try {
        const deptName = (_l = (_k = req.query) === null || _k === void 0 ? void 0 : _k.dept) === null || _l === void 0 ? void 0 : _l.toLowerCase();
        const doctors = yield Doctor_model_1.default.find({ deptName: deptName });
        messageStatus_1.successMessage(res, doctors);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.acceptAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientId = req.query.patientId;
        const to = req.query.to || new Date().toDateString();
        const from = req.query.from || new Date().toDateString();
        const patient = yield Patient_model_1.default.findById(patientId);
        const isPatient = lodash_1.default.isEmpty(patient);
        if (isPatient) {
            messageStatus_1.errorMessage(res, "Not Found!!!", 404);
        }
        patient.doctorAccept = true;
        patient.appointment.from = from;
        patient.appointment.to = to;
        const patientFound = yield Patient_model_1.default.findByIdAndUpdate(patientId, patient, { new: true });
        messageStatus_1.successMessage(res, patientFound);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
// beginning of user controller
// export const createUser = async (req: Request, res: Response) => {
//   try {
//     const {values, error} = userFieldValidation(req.body)
//     const accountNumber = `medi-${uuid()}`
//     if(!values) {
//       return res.status(404).json({status: 'error', error})
//     }
//     const isDoctor = req.body.isDoctor ? true : false
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(values.password, salt)
//     const user: any = new UserModel({...values, name: values.name?.toLowerCase(), isDoctor, password: hashedPassword})
//     let doctorUser: any
//     if(user?.isDoctor) {
//       doctorUser = new NewDoctorModel({
//         ...req.body,
//         doctor: user?._id,
//         password: hashedPassword
//       })
//       await doctorUser.save()
//     }
//     await user.save()
//     let dept: any
//     if(user?.isDoctor) {
//       dept = await DeptModel.findOne({name: doctorUser?.deptName})
//       if(!dept?.name) {
//         return errorMessage(res, "Dept Name not found", 404)
//       }
//       let doctorArray = dept?.doctor?.concat(user?._id)
//       doctorArray = _.uniqBy(doctorArray, (id) => JSON.stringify(id))
//       await DeptModel.findByIdAndUpdate(dept?.id, {doctor: doctorArray}, {new: true})
//       await UserModel.findByIdAndUpdate(user?._id, {doctor: doctorUser?._id, dept: dept?._id}, {new: true})
//     }
//     const wallet = new WalletModel({accountNumber, user: user?._id})
//     await wallet.save()
//     await UserModel.findByIdAndUpdate(user?._id, {wallet: wallet._id}, {new: true})
//     const token = await generateToken(doctorUser)
//     res.json({status: 'success', data: isDoctor ? {doctorUser, token, wallet, dept} : {user, token, wallet}})
//   } catch (error) {
//     // res.status(500).json({status: 'error', error: error.code === 11000 ? "A field is unique" : "An error occured"})
//     return errorMessage(res, error.message, 400)
//   }
// }
// export const getAllUsers = async (_req: Request, res: Response) => {
//   try {
//     const users = await UserModel.find().populate('doctor').populate("wallet")
//     res.json({status: 'success', data: users})
//   } catch (error) {
//     const err = error.code === 11000 ? "A field is unique" : "An error occured"
//     return errorMessage(res, err, 400)
//   }
// }
// // get all doctors only
// export const getAllDoctors = async (_req: Request, res: Response) => {
//   try {
//     const doctors = await UserModel.find({
//       isDoctor: true
//     })
//     successMessage(res, doctors)
//   } catch (error) {
//     return errorMessage(res, error.message, 400)
//   }
// }
// export const getUserById = async (req: Request, res: Response) => {
//   try {
//     const doctors = await UserModel.find({
//       isDoctor: true
//     }).populate({
//       path: 'dept',
//       select: {
//         doctor: 0,
//         doctors: 0
//       }
//     }).populate('patients').populate('wallet')
//     successMessage(res, doctors)
//   } catch (error) {
//     return errorMessage(res, error.message, 400)
//   }
// }
// export const deleteUser = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.userId
//     const user: any = await UserModel.findById(userId)
//     if(!user?._id) {
//       return errorMessage(res, "User not found", 404)
//     }
//     // const deletedDoctorDetail = await NewDoctorModel.findByIdAndDelete(user?.doctors)
//     // const deletedUserWallet = await WalletModel.findByIdAndDelete(user?.wallet)
//     // const deletedUser = await UserModel.findByIdAndDelete(userId)
//     Promise.all([
//       await NewDoctorModel.findByIdAndDelete(user?.doctor),
//       await WalletModel.findByIdAndDelete(user?.wallet),
//       await UserModel.findByIdAndDelete(userId)
//     ])
//     successMessage(res, "User deleted successfully")
//   } catch (error) {
//     return errorMessage(res, error.message, 400)
//   }
// }
// end of user controller
//# sourceMappingURL=doctor.controller.js.map