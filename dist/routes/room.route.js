"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_controller_1 = require("../controllers/room.controller");
const router = express_1.Router();
router.route("/rooms/availability").get(room_controller_1.getAvailableRooms);
router.route("/room").post(room_controller_1.createRoom);
router.route("/room/assign/patient").patch(room_controller_1.assignPatientToRoom);
router.route("/room/unassign/patient").patch(room_controller_1.unAssignPatientToRoom);
exports.default = router;
//# sourceMappingURL=room.route.js.map