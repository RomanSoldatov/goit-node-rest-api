import * as authService from "../services/authServices.js";

export const register = async (req, res, next) => {
  try {
    const registeredUser = await authService.registerUser(req.body);
    res.status(201).json({
      user: {
        email: registeredUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const token = await authService.loginUser(req.body);
    res.json({
      token,
    });
  } catch (error) {
    next(error);
  }
};
