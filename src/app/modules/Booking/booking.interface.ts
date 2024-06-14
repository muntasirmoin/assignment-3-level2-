import { ObjectId } from "mongoose";
export interface TBooking {
  customer: ObjectId;
  serviceId: ObjectId;
  slotId: ObjectId;
  vehicleType:
    | "car"
    | "truck"
    | "SUV"
    | "van"
    | "motorcycle"
    | "bus"
    | "electricVehicle"
    | "hybridVehicle"
    | "bicycle"
    | "tractor";
  vehicleBrand: string;
  vehicleModel: string;
  manufacturingYear: string;
  registrationPlate: string;
}

// customer: Reference to the user who made the booking.
// service: Reference to the booked service.
// slot: Reference to the booking slot.
// vehicleType: Type of the vehicle (enum: car, truck, SUV, van, motorcycle, bus, electricVehicle, hybridVehicle, bicycle, tractor).
// vehicleBrand: Brand or manufacturer of the vehicle.
// vehicleModel: Model or variant of the vehicle.
// manufacturingYear: Manufacturing year of the vehicle.
// registrationPlate: Unique registration number assigned to the vehicle.
