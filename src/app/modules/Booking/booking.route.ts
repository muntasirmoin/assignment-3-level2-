import express from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.interface";
const router = express.Router();

// Route: /api/bookings(POST)

router.post("/", auth(USER_ROLE.user), bookingControllers.createBooking);
// router.post("/", bookingControllers.createBooking);

// Route: /api/bookings(GET)

router.get("/", bookingControllers.getAllBooking);

export const bookingRoutes = router;
