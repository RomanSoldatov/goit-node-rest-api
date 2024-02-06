import { User } from "../models/user.js";
import { HttpError } from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { SECRET_KEY } = process.env;

export const registerUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const result = await User.create({ ...data, password: hashPassword });
  return result;
};

export const loginUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  return { user, token };
};

export const logoutUser = async (req) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  return;
};
