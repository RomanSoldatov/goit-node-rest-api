import express from "express";
import { validateBody } from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";
import { register, login } from "../controllers/authControllers.js";

export const authRouter = express.Router();
// signup
authRouter.post("/register", validateBody(registerSchema), register);

// signin
authRouter.post("/login", validateBody(loginSchema), login);

// router.get("/current", authenticate, ctrl.getCurrent);

// router.post("/logout", authenticate, ctrl.logout);
