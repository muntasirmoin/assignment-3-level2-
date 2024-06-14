import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import path from "path";
import { ServiceRoutes } from "../modules/Service/service.route";
import { slotRoutes } from "../modules/Slot/slot.route";
import { bookingRoutes } from "../modules/Booking/booking.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: UserRoutes,
  },
  {
    path: "/services",
    route: ServiceRoutes,
  },
  {
    path: "/slots",
    route: slotRoutes,
  },
  {
    path: "/bookings",
    route: bookingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
