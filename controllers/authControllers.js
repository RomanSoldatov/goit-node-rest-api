import * as authService from "../services/authServices.js";

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
