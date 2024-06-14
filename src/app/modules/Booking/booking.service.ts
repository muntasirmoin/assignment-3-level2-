import { TBooking } from "./booking.interface";
import { bookingModel } from "./booking.model";

const createBookingIntoDB = async (payload: TBooking) => {
  // check user ke token theke ene patathe hove i mean login user

  //   const payloadWithUser = { ...payload, customer: here give value };

  const result = await bookingModel.create(payload);

  return result;
};

const getAllBookingFromDb = async () => {
  //   console.log(query);
  const result = bookingModel
    .find()
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
  return result;
};

export const bookingServices = {
  createBookingIntoDB,
  getAllBookingFromDb,
};
