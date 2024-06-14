import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { serviceValidation } from "./service.validate";
import { ServiceControllers } from "./service.controller";
import { slotController } from "../Slot/slot.controller";
import { slotValidation } from "../Slot/slot.validate";

const router = express.Router();
// Route: /api/services(POST)
// check
router.post(
  "/",
  validateRequest(serviceValidation.serviceValidationSchema),
  ServiceControllers.createService
);

// get single data
// /api/services/:id(GET)
router.get("/:id", ServiceControllers.getSingleService);

// get all data
// /api/services
router.get("/", ServiceControllers.getAllService);

// update data
// Route: /api/services/:id(PUT)
// check
router.put("/:id", ServiceControllers.updateService);

// delete
// Route: /api/services/:id(DELETE) [SOFT DELETE ]
// check
router.delete("/:id", ServiceControllers.deleteService);

// slot er kaj route ei jagay
router.post(
  "/slots",
  validateRequest(slotValidation.slotValidationSchema),
  slotController.createSlot
);

export const ServiceRoutes = router;
