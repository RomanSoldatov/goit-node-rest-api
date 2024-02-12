import * as authService from "../services/authServices.js";
// import { User } from "../models/user.js";

// import fs from "fs/promises";
// import Jimp from "jimp";
// import path from "path";
// import { fileURLToPath } from "url";
// import { join, dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export const register = async (req, res, next) => {
  try {
    const registeredUser = await authService.registerUser(req.body);
    res.status(201).json({
      user: {
        email: registeredUser.email,
        subscription: registeredUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const loginedUser = await authService.loginUser(req.body);
    res.json({
      token: loginedUser.token,
      user: {
        email: loginedUser.user.email,
        subscription: loginedUser.user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  try {
    await authService.logoutUser(req);
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const result = await authService.updateUserAvatar(req);
    res.status(200).json({ avatarURL: result.avatarURL });
  } catch (error) {
    next(error);
  }
};
