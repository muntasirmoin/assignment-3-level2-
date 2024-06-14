import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { slotModel } from "../Slot/slot.model";
import { bookingModel } from "./booking.model";
import { bookingServices } from "./booking.service";
import httpStatus from "http-status";
import sendResponseToken from "../../utils/semResponseToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";

const createBooking = catchAsync(async (req, res) => {
  const bookingData = req.body;

  //
  //
  const token = req.headers.authorization;
  // console.log(token);
  if (!token) {
    return sendResponseToken(res, {
      statusCode: 401,
      success: false,
      message: "You have no access to this route",
    });
  }
  const tokenWithOutBearer = token.split(" ")[1];

  if (!tokenWithOutBearer) {
    return sendResponseToken(res, {
      statusCode: 401,
      success: false,
      message: "You have no access to this route",
    });
  }

  // checking if the given token is valid
  const decoded = jwt.verify(
    tokenWithOutBearer as string,
    config.jwt_access_secret as string
  ) as JwtPayload;

  const { role, userId, iat } = decoded;

  const { ...payload } = req.body;
  const payloadWithUserCustomer = { ...payload, customer: userId };
  // console.log("insideBooking", payloadWithUserCustomer, "decoded", decoded);

  //
  const slot = await slotModel.findByIdAndUpdate(
    bookingData.slotId,
    { isBooked: "booked" },
    { new: true }
  );
  const result = await bookingServices.createBookingIntoDB(
    payloadWithUserCustomer
  );
  const responseResult = await bookingModel
    .findById(result._id)
    .populate({
      path: "customer",
      select: "-password -role -createdAt -updatedAt", // Exclude the password field
    })
    .populate({
      path: "serviceId",
      select: "-createdAt -updatedAt",
    })
    .populate({
      path: "slotId",
      select: "-createdAt -updatedAt",
    });

  // // Exclude password and __v fields in the query result
  // const responseResult = await userModel
  //   .findOne(result._id)
  //   .select("-password -__v");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking successful",
    data: responseResult,
  });
});

const getAllBooking: RequestHandler = catchAsync(async (req, res) => {
  const result = await bookingServices.getAllBookingFromDb();

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: [],
    });
  }
  // console.log("result", result.);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All bookings retrieved successfully",
    data: result,
  });
});

//
// get single service
const getSingleMyBooking = catchAsync(async (req, res) => {
  // const { id } = req.params;
  //
  const token = req.headers.authorization;
  if (!token) {
    return sendResponseToken(res, {
      statusCode: 401,
      success: false,
      message: "You have no access to this route",
    });
  }

  const tokenWithOutBearer = token.split(" ")[1];

  if (!tokenWithOutBearer) {
    return sendResponseToken(res, {
      statusCode: 401,
      success: false,
      message: "You have no access to this route",
    });
  }

  // checking if the given token is valid
  const decoded = jwt.verify(
    tokenWithOutBearer as string,
    config.jwt_access_secret as string
  ) as JwtPayload;
  const { role, userId, iat } = decoded;
  //

  const result = await bookingServices.getSingleMyBookingFromDB(userId);
  console.log(result, userId);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: [],
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User bookings retrieved successfully",
    data: result,
  });
});

//

export const bookingControllers = {
  createBooking,
  getAllBooking,
  getSingleMyBooking,
};
