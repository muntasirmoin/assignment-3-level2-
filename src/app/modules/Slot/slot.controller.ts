import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { serviceModel } from "../Service/service.model";
import { calculateMinutes } from "./slot.constatnt";
import { TSlot } from "./slot.interface";
import { slotModel } from "./slot.model";
import { slotServices } from "./slot.service";
import httpStatus from "http-status";

const createSlot = catchAsync(async (req, res) => {
  const slotData = req.body;
  // console.log(slotData);
  //   const { service, date, startTime, endTime, isBooked } = req.body;

  //   const slot = await slotModel.findById().populate("services");

  //   console.log(service, date, startTime, endTime, isBooked);

  //   main code
  //   console.log("start", slotData, "end");
  const result = await slotServices.createSlotIntoDB(slotData);
  // console.log("controller result", result);
  //   const responseResult = await slotModel.findOne(slotData._id).select("-__v");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Slot created successfully",
    // data: responseResult,
    data: result,
  });
});

const getAllSlots: RequestHandler = catchAsync(async (req, res) => {
  const result = await slotServices.getAllSlotFromDb(req.query);
  //   console.log("result", result);

  if (!result || result.length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: [],
      //     "success": false,
      // "statusCode": 404,
      // "message": "No Data Found",
      // "data":[]
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Available slots retrieved successfully",
    data: result,
  });
});

export const slotController = {
  createSlot,
  getAllSlots,
};
