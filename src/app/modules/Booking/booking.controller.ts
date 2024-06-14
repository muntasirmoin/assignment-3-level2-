import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { slotModel } from "../Slot/slot.model";
import { bookingModel } from "./booking.model";
import { bookingServices } from "./booking.service";
import httpStatus from "http-status";

const createBooking = catchAsync(async (req, res) => {
  const bookingData = req.body;

  const slot = await slotModel.findByIdAndUpdate(
    bookingData.slotId,
    { isBooked: "booked" },
    { new: true }
  );
  const result = await bookingServices.createBookingIntoDB(bookingData);
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

export const bookingControllers = {
  createBooking,
  getAllBooking,
};
