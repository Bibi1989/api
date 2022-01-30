"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_controller_1 = require("../controllers/doctor.controller");
const router = express_1.Router();
router.route("/doctors").get(doctor_controller_1.getAllDoctors);
router.route("/doctor/:doctorId").get(doctor_controller_1.getDoctotorProfile);
// router.route("/doctors/users").get(getAllUsers);
router.route("/doctors/accept").get(doctor_controller_1.acceptAppointment);
router.route("/doctors/search").get(doctor_controller_1.getAllDoctorsByDept);
router.route("/doctor/signin").post(doctor_controller_1.signinDoctor);
router.route("/doctor/signup").post(doctor_controller_1.createDoctorProfile);
// router.route("/user").post(createUser);
router.route("/doctors/:doctorId").put(doctor_controller_1.updateDoctorProfile);
router.route("/doctors/assign").patch(doctor_controller_1.assignDoctorToPatient);
// router.route("/user/:userId").delete(deleteUser);
exports.default = router;
//# sourceMappingURL=doctor.route.js.map