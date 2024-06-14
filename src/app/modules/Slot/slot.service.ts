import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { serviceModel } from "../Service/service.model";
import { calculateMinutes } from "./slot.constatnt";
import { TSlot } from "./slot.interface";
import { slotModel } from "./slot.model";

const createSlotIntoDB = async (payload: TSlot) => {
  // 2. Parse Request Body
  const { service, date, startTime, endTime, isBooked } = payload;
  const serviceData = await serviceModel.findById(service);
  //   const serviceDuration = serviceData?.duration;
  //   const serviceDuration = 60;
  const serviceDuration: number = serviceData?.duration || 60;

  //   3. Calculate the Total Duration

  const startTimeMin = calculateMinutes(startTime);
  const endTimeMin = calculateMinutes(endTime);
  const totalDuration = endTimeMin - startTimeMin;

  //    4. Generate Slot Time Intervals
  const numberOfSlots = totalDuration / serviceDuration;

  //  5
  const slots: TSlot[] = [];
  let currentStartMinutes = startTimeMin;
  for (let i = 0; i < numberOfSlots; i++) {
    const slotStartTime = `${String(Math.floor(currentStartMinutes / 60)).padStart(2, "0")}:${String(currentStartMinutes % 60).padStart(2, "0")}`;
    const slotEndTime = `${String(Math.floor((currentStartMinutes + serviceDuration) / 60)).padStart(2, "0")}:${String((currentStartMinutes + serviceDuration) % 60).padStart(2, "0")}`;

    const slot: TSlot = new slotModel({
      service: service,
      date,
      startTime: slotStartTime,
      endTime: slotEndTime,
      isBooked: "available",
    });

    // await slot.save();
    slots.push(slot);
    // console.log(slots);
    currentStartMinutes += serviceDuration;
  }

  return await slotModel.create(slots);
};

const getAllSlotFromDb = async (query: Record<string, unknown>) => {
  //   console.log(query);
  //   const result = slotModel.find(query).populate("service");
  //   console.log(query);
  //   return result;
  const { date, serviceId } = query;
  const availableSlots = await slotModel
    .find({
      date: date,
      service: serviceId,
      isBooked: "available",
    })
    .populate("service");

  // if (!availableSlots || availableSlots.length === 0) {
  //   throw new AppError(httpStatus.NOT_FOUND, "No available slots found");
  // }

  return availableSlots;
};

export const slotServices = {
  createSlotIntoDB,
  getAllSlotFromDb,
};
