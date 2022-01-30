"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Schema.Types;
const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
const PatientSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    doctorAccept: {
        type: Boolean,
        default: false
    },
    appointment: {
        to: {
            type: Date
        },
        from: {
            type: Date
        }
    },
    doctor: {
        type: ObjectId,
        ref: "doctor",
    },
    wallet: {
        type: ObjectId,
        ref: "wallet",
    },
    room: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "room",
    },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("patient", PatientSchema);
//# sourceMappingURL=Patient.model.js.map