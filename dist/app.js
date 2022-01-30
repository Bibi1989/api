"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const dbConnect_1 = require("./dbConnect");
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
dbConnect_1.connectDB();
const app = express_1.default();
// import routes from the route module
const user_route_1 = __importDefault(require("./routes/user.route"));
const food_route_1 = __importDefault(require("./routes/food.route"));
app.use(express_fileupload_1.default({ useTempFiles: true }));
app.use(cors_1.default());
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
// endpoints for imported routes
app.use("/api/v1", user_route_1.default);
app.use("/api/v1/foods", food_route_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(http_errors_1.default(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.json({ status: "error", error: "Something went wrong" });
});
exports.default = app;
//# sourceMappingURL=app.js.map