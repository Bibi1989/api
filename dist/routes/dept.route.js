"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dept_controller_1 = require("../controllers/dept.controller");
const router = express_1.Router();
router.route("/depts").get(dept_controller_1.getDepts);
router.route("/symptoms").get(dept_controller_1.getAllSymptoms);
router.route("/depts/search").get(dept_controller_1.getDeptByName);
router.route("/dept").post(dept_controller_1.createDept);
router.route("/dept/assign").patch(dept_controller_1.assignDept);
router.route("/dept/unassign").patch(dept_controller_1.unAssignDept);
router.route("/dept/:deptId").put(dept_controller_1.updateDept);
exports.default = router;
//# sourceMappingURL=dept.route.js.map