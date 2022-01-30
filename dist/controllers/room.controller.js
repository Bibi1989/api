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
const Room_model_1 = __importDefault(require("../models/Room.model"));
const Patient_model_1 = __importDefault(require("../models/Patient.model"));
const logErrors = (values) => {
    const errors = {
        roomNo: null,
        location: null,
    };
    if (!values.roomNo) {
        errors.roomNo = "roomNo is empty";
    }
    if (!values.location) {
        errors.location = "location is empty";
    }
    return values.roomNo && values.location
        ? { values, error: "" }
        : { values: "", error: errors };
};
exports.createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { values, error } = logErrors(req.body);
        if (!values) {
            return messageStatus_1.errorMessage(res, error, 404);
        }
        let room = new Room_model_1.default(values);
        yield room.save();
        room = yield Room_model_1.default.populate(room, { path: "patients" });
        messageStatus_1.successMessage(res, room);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.assignPatientToRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const patientId = req.query.patientId;
        const roomId = req.query.roomId;
        const noOfPatientAllowInARoom = req.query.noPerRoom || 1;
        const findRoom = yield Room_model_1.default.findById(roomId);
        const isRoomFound = lodash_1.default.isEmpty(findRoom);
        if (isRoomFound) {
            return messageStatus_1.errorMessage(res, "Not found!!!", 404);
        }
        let patientsId = (_b = (_a = findRoom) === null || _a === void 0 ? void 0 : _a.patients) === null || _b === void 0 ? void 0 : _b.concat(patientId);
        patientsId = lodash_1.default.uniqBy(patientsId, (id) => JSON.stringify(id));
        const isAvailable = patientsId.length < noOfPatientAllowInARoom ? true : false;
        console.log(isAvailable, patientsId.length);
        const room = yield Room_model_1.default.findByIdAndUpdate(roomId, { patients: patientsId, isAvailable }, { new: true });
        yield Patient_model_1.default.findByIdAndUpdate(patientId, { room: roomId }, { new: true });
        messageStatus_1.successMessage(res, room);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.unAssignPatientToRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const patientId = req.query.patientId;
        const roomId = req.query.roomId;
        const noOfPatientAllowInARoom = req.query.noPerRoom || 1;
        const findRoom = yield Room_model_1.default.findById(roomId);
        const isRoomFound = lodash_1.default.isEmpty(findRoom);
        if (isRoomFound) {
            return messageStatus_1.errorMessage(res, "Not found!!!", 404);
        }
        // let patientsId = findRoom?.patients?.concat(patientId)
        // patientsId = _.uniqBy(patientsId, (id) => JSON.stringify(id))
        let find = lodash_1.default.filter(lodash_1.default.uniq((_c = findRoom) === null || _c === void 0 ? void 0 : _c.patients), (id) => {
            let newId = JSON.stringify(id);
            return newId !== JSON.stringify(patientId);
        });
        const isAvailable = find.length < noOfPatientAllowInARoom ? true : false;
        const room = yield Room_model_1.default.findByIdAndUpdate(roomId, { patients: find, isAvailable }, { new: true });
        yield Patient_model_1.default.findByIdAndUpdate(patientId, { room: null }, { new: true });
        messageStatus_1.successMessage(res, room);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.getAllRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield Room_model_1.default.find({});
        messageStatus_1.successMessage(res, rooms);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
exports.getAvailableRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            patients: {
                $size: 0,
            },
        };
        const rooms = yield Room_model_1.default.find();
        messageStatus_1.successMessage(res, rooms);
    }
    catch (error) {
        return messageStatus_1.errorMessage(res, error.message, 400);
    }
});
//# sourceMappingURL=room.controller.js.map