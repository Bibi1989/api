"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
const NewDoctorSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    deptName: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    address: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    from: {
        type: Date,
    },
    to: {
        type: Date,
    },
    yoe: {
        type: Number,
    },
    experience: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    dept: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'dept',
    },
    doctor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
    },
    services: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "service"
        }
    ],
    patients: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "patient"
        }],
});
exports.default = mongoose_1.default.model("newdoctor", NewDoctorSchema);
//# sourceMappingURL=NewDoctor.model.js.map