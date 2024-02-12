import express from "express";
import { validateBody } from "../helpers/validateBody.js";
import { authenticate } from "../helpers/authenticate.js";
import { upload } from "../helpers/upload.js";
import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";
import {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
} from "../controllers/authControllers.js";

export const usersRouter = express.Router();
// signup
usersRouter.post("/register", validateBody(registerSchema), register);

// signin
usersRouter.post("/login", validateBody(loginSchema), login);

usersRouter.get("/current", authenticate, getCurrent);

usersRouter.post("/logout", authenticate, logout);

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);
