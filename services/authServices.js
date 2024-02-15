import { User } from "../models/user.js";
import { HttpError } from "../helpers/HttpError.js";
import { sendEmail } from "../helpers/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import dotenv from "dotenv";
import fs from "fs/promises";
import Jimp from "jimp";
import path from "path";
import { nanoid } from "nanoid";

dotenv.config();

const { SECRET_KEY, BASE_URL } = process.env;

export const registerUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await User.create({
    ...data,
    avatarURL,
    password: hashPassword,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);
  return result;
};

export const verifyUserEmail = async (req) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  return;
};
export const resendVerifyUserEmail = async (req) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);
  return;
};

export const loginUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
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
