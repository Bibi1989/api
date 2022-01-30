"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.Router();
router.route("/me").get(user_controller_1.me);
router.route("/register").post(user_controller_1.createUser);
router.route("/login").post(user_controller_1.signinUser);
exports.default = router;
//# sourceMappingURL=user.route.js.map