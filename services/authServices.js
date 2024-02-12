import { User } from "../models/user.js";
import { HttpError } from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import dotenv from "dotenv";
import fs from "fs/promises";
import Jimp from "jimp";
import path from "path";
dotenv.config();

const { SECRET_KEY } = process.env;

export const registerUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await User.create({
    ...data,
    avatarURL,
    password: hashPassword,
  });
  console.log(avatarURL);
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
export const updateUserAvatar = async (req) => {
  const { _id } = req.user;

  if (!req.file) throw HttpError(400, "Avatar file is required");
  const { path: tempUpload, originalname } = req.file;
  const newFilename = `${_id}_${originalname}`;
  const resultUpload = path.resolve("public", "avatars", newFilename);
  // Resize avatar to 250x250 using jimp
  const avatar = await Jimp.read(tempUpload);
  avatar.cover(250, 250).write(resultUpload);
  // Remove the temporary uploaded file
  await fs.unlink(tempUpload);

  const result = await User.findByIdAndUpdate(_id, { avatarURL: resultUpload });
  console.log(result);
  return result;
};
