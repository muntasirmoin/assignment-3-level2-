import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { userModel } from "./user.model";
import sendResponseToken from "../../utils/semResponseToken";
import config from "../../config";

const createUser = catchAsync(async (req, res) => {
  const userData = req.body;

  const result = await UserServices.createAdminIntoDB(userData);

  // Exclude password and __v fields in the query result
  const responseResult = await userModel
    .findOne(result._id)
    .select("-password -__v");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User registered successfully",
    data: responseResult,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUser(req.body);
  const { refreshToken, accessToken, user } = result;
  const responseResult = await userModel
    .findOne(user._id)
    .select("-password -__v");

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  //
  const accessTokenWithoutBearer = accessToken.replace("Bearer ", "");

  //

  sendResponseToken(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    token: accessTokenWithoutBearer,
    data: responseResult,
  });
});

export const UserControllers = {
  createUser,
  loginUser,
};
