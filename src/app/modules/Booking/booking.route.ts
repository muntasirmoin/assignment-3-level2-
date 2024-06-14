import express from "express";
import { bookingControllers } from "./booking.controller";
const router = express.Router();

// Route: /api/bookings(POST)

router.post("/", bookingControllers.createBooking);

// Route: /api/bookings(GET)

router.get("/", bookingControllers.getAllBooking);

export const bookingRoutes = router;
