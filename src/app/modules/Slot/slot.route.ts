import express from "express";
import { slotController } from "./slot.controller";

const router = express.Router();

// /api/services/slots(POST)

// 9. Get available slots
// Route: /api/slots/availability(GET)

router.get("/availability", slotController.getAllSlots);

export const slotRoutes = router;
