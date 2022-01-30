"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_controller_1 = require("../controllers/wallet.controller");
const router = express_1.Router();
router.route("/wallet").post(wallet_controller_1.createWallet);
exports.default = router;
//# sourceMappingURL=wallet.route.js.map