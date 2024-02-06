import express from "express";
import { validateBody } from "../helpers/validateBody.js";
import { authenticate } from "../helpers/authenticate.js";
import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";
import {
  register,
  login,
  getCurrent,
  logout,
} from "../controllers/authControllers.js";

export const authRouter = express.Router();
// signup
authRouter.post("/register", validateBody(registerSchema), register);

// signin
authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);
