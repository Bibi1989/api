"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successMessage = (res, data) => {
    res.json({ status: "success", data });
};
exports.errorMessage = (res, message, statusCode) => {
    res.status(statusCode).json({ status: "success", error: message });
};
//# sourceMappingURL=successMessage.js.map