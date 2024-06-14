import { TBooking } from "./booking.interface";
import { bookingModel } from "./booking.model";

const createBookingIntoDB = async (payload: TBooking) => {
  const result = await bookingModel.create(payload);

  return result;
};

const getAllBookingFromDb = async () => {
  const result = bookingModel
    .find()
    .populate({
      path: "customer",
      select: "-password -role -createdAt -updatedAt", // Exclude the -password -role -createdAt -updatedAt field
    })
    .populate({
      path: "serviceId",
      select: "-createdAt -updatedAt",
    })
    .populate({
      path: "slotId",
      select: "-createdAt -updatedAt",
    });
  return result;
};

const getSingleMyBookingFromDB = async (customerId: string) => {
  const result = await bookingModel
    .find({ customer: customerId })
    .select("-customer")
    .populate({
      path: "serviceId",
      select: "-createdAt -updatedAt",
    })
    .populate({
      path: "slotId",
      select: "-createdAt -updatedAt",
    });

  return result;
};

export const bookingServices = {
  createBookingIntoDB,
  getAllBookingFromDb,
  getSingleMyBookingFromDB,
};
