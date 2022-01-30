"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successMessage = (res, data) => {
    res.json({ status: "success", data });
};
exports.errorMessage = (res, message, statusCode) => {
    return res.status(statusCode).json({ status: "error", error: message });
};
//# sourceMappingURL=messageStatus.js.map