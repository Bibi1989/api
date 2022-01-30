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
const Dept_model_1 = __importDefault(require("../models/Dept.model"));
const Doctor_model_1 = __importDefault(require("../models/Doctor.model"));
const uuidv4_1 = require("uuidv4");
const departments = [
    {
        "name": "surgery",
    },
    {
        "name": "casualty",
    },
    {
        "name": "intensive care unit",
    },
    {
        "name": "gynecology",
    },
    {
        "name": "haematology",
    },
    {
        "name": "health & safety",
    },
    {
        "name": "maternity",
    },
    {
        "name": "nephrology",
    },
    {
        "name": "neurology",
    },
    {
        "name": "ophthalmology",
    },
    {
        "name": "oncology",
    },
    {
        "name": "pharmacy",
    },
    {
        "name": "radiology",
    },
    {
        "name": "renal",
    },
    {
        "name": "coronary care unit",
    }
];
exports.createDept = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.name) {
            return messageStatus_1.errorMessage(res, "Department name is required", 404);
        }
        const dept = new Dept_model_1.default(req.body);
        yield dept.save();
        messageStatus_1.successMessage(res, dept);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.assignDept = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const deptId = req.body.deptId;
        const doctorId = req.body.doctorId;
        const findDept = yield Dept_model_1.default.findById(deptId);
        let find = (_a = findDept) === null || _a === void 0 ? void 0 : _a.doctor.concat(doctorId);
        console.log(doctorId);
        find = lodash_1.default.uniqBy(find, (id) => JSON.stringify(id));
        const dept = yield Dept_model_1.default.findByIdAndUpdate(deptId, { doctor: find }, { new: true });
        yield Doctor_model_1.default.findByIdAndUpdate(doctorId, { dept: deptId }, { new: true });
        messageStatus_1.successMessage(res, dept);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.unAssignDept = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const deptId = req.query.deptId;
        const doctorId = req.query.doctorId;
        const findDept = yield Dept_model_1.default.findById(deptId);
        let find = lodash_1.default.filter(lodash_1.default.uniq((_b = findDept) === null || _b === void 0 ? void 0 : _b.doctor), (id) => {
            let newId = JSON.stringify(id);
            return newId !== JSON.stringify(doctorId);
        });
        const dept = yield Dept_model_1.default.findByIdAndUpdate(deptId, { doctor: find }, { new: true });
        messageStatus_1.successMessage(res, dept);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.updateDept = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.deptId);
        if (!req.body.name) {
            return messageStatus_1.errorMessage(res, "Department name is required", 404);
        }
        const foundDept = yield Dept_model_1.default.findById(req.params.deptId);
        if (!foundDept.name) {
            return messageStatus_1.errorMessage(res, "Department id not found", 404);
        }
        const dept = yield Dept_model_1.default.findByIdAndUpdate(req.params.deptId, req.body, { new: true });
        messageStatus_1.successMessage(res, dept);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.deleteDept = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundDept = yield Dept_model_1.default.findById(req.params.deptId);
        const isNotFound = lodash_1.default.isEmpty(foundDept);
        if (isNotFound) {
            messageStatus_1.errorMessage(res, "Not found!!!", 404);
        }
        const depts = yield Dept_model_1.default.findByIdAndDelete(req.params.deptId);
        messageStatus_1.successMessage(res, depts);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, "An error occured", 400);
    }
});
exports.getDepts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const depts = yield Dept_model_1.default.find({});
        messageStatus_1.successMessage(res, depts);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.getAllSymptoms = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let symptoms = yield Dept_model_1.default.find({});
        symptoms = lodash_1.default.map(lodash_1.default.flatMap(lodash_1.default.map(symptoms, (symp) => { var _a; return (_a = symp) === null || _a === void 0 ? void 0 : _a.symptoms; })), (symp) => ({ symptom: symp, id: uuidv4_1.uuid() }));
        messageStatus_1.successMessage(res, symptoms);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.getDeptByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const name = (_d = (_c = req.query) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.toLowerCase();
        const depts = yield Dept_model_1.default.find({ name: { $regex: name } }).populate('doctors');
        messageStatus_1.successMessage(res, depts);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, "An error occured", 400);
    }
});
//# sourceMappingURL=dept.controller.js.map