import { Router } from "express";
import { createUser, me, signinUser } from "../controllers/user.controller";

const router = Router();

router.route("/me").get(me);

router.route("/register").post(createUser);

router.route("/login").post(signinUser);

export default router;
