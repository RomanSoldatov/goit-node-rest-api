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

export const verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyUserEmail(req);
    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    await authService.resendVerifyUserEmail(req);
    res.json({
      message: "Verify email send success",
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
