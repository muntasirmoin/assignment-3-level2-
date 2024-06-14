import express from "express";
import { bookingControllers } from "./booking.controller";
// import auth from "../../middlewares/auth";
// import { USER_ROLE } from "../User/user.interface";
const router = express.Router();

router.get("/", bookingControllers.getSingleMyBooking);

export const bookingMyRoutes = router;
