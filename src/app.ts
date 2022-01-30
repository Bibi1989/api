import express, { Request, Response, NextFunction } from "express";
import createError, { HttpError } from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import dotenv from "dotenv";
import fileupload from "express-fileupload";
import { connectDB } from "./dbConnect";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

connectDB();

const app = express();

// import routes from the route module
import userRoute from "./routes/user.route";
import foodRoute from "./routes/food.route";

app.use(fileupload({ useTempFiles: true }));
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// endpoints for imported routes
app.use("/api/v1", userRoute);
app.use("/api/v1/foods", foodRoute);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ status: "error", error: "Something went wrong" });
});

export default app;
