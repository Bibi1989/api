"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_1 = require("../controllers/patient.controller");
const router = express_1.Router();
router.route('/patients').get(patient_controller_1.getAllPatients);
router.route('/patients/:patientId').get(patient_controller_1.getPatientProfile);
router.route("/patient/signin").post(patient_controller_1.signinPatient);
router.route("/patient/signup").post(patient_controller_1.createPatient);
// router.route("/patient/assign/doctor").patch(assignPatientToDoctor);
// router.route("/patient/assign/room").patch(assignPatientToRoom);
exports.default = router;
//# sourceMappingURL=patient.route.js.map