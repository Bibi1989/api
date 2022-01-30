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
const DoctorSchema = new mongoose_1.default.Schema({
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
    sex: {
        type: String,
        required: true
    },
    deptName: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
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
        type: String,
    },
    experience: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    dept: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'dept',
    },
    wallet: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'wallet',
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
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("doctor", DoctorSchema);
//# sourceMappingURL=Doctor.model.js.map