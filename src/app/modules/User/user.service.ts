// import AppError from "../../errors/AppError";

import mongoose from "mongoose";
import config from "../../config";
import { TLoginUser, TUser } from "./user.interface";
import { userModel } from "./user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { createToken } from "./user.utils";

const createAdminIntoDB = async (payload: TUser) => {
  // hashing password here
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  // Replace the plain password with the hashed password
  const payloadWithHashedPassword = { ...payload, password: hashedPassword };

  const result = await userModel.create(payloadWithHashedPassword);

  return result;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await userModel.findOne({ email: payload?.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const passwordMatch = await bcrypt.compare(payload.password, user.password);

  if (!passwordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  // create token and send to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  // Create access token with "Bearer" prefix
  // const accessToken = `Bearer ${createToken(
  //   jwtPayload,
  //   config.jwt_access_secret as string,
  //   config.jwt_access_expires_in as string
  // )}`;

  // console.log("accessToken", accessToken);

  // Create refresh token with "Bearer" prefix
  // const refreshToken = `Bearer ${createToken(
  //   jwtPayload,
  //   config.jwt_refresh_secret as string,
  //   config.jwt_refresh_expires_in as string
  // )}`;

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,

    user,
    refreshToken,
  };
};

export const UserServices = {
  createAdminIntoDB,
  loginUser,
};
