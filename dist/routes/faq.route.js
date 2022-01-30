"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faq_controller_1 = require("../controllers/faq.controller");
const router = express_1.Router();
router.route("/fags").get(faq_controller_1.getFaqs);
router.route("/fags/:id").get(faq_controller_1.getFaq);
router.route("/fags").post(faq_controller_1.createFaq);
exports.default = router;
//# sourceMappingURL=faq.route.js.map