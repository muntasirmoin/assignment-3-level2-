import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
// import { User } from '../modules/student/user/user.model'
import config from "../config";
import { TUserRole } from "../modules/User/user.interface";
import { userModel } from "../modules/User/user.model";
import sendResponse from "../utils/sendResponse";
import sendResponseToken from "../utils/semResponseToken";
// import { TUserRole } from '../modules/student/user/user.interface'
// middleware
export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // if the token is sent from client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorized");
    }
    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { role, userId, iat } = decoded;
    // const { userId, role } = decoded
    // console.log('in auth.ts', decoded)

    // checking if the user is exist
    const user = await userModel.isUserExistsByCustomId(userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }

    // rules
    if (requiredRoles && !requiredRoles.includes(role)) {
      //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized  hi!')
      sendResponseToken(res, {
        statusCode: 401,
        success: false,
        message: "You have no access to this route",
      });
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
