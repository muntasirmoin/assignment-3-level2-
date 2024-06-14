import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { slotServices } from "./slot.service";
import httpStatus from "http-status";

const createSlot = catchAsync(async (req, res) => {
  const slotData = req.body;

  const result = await slotServices.createSlotIntoDB(slotData);

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
