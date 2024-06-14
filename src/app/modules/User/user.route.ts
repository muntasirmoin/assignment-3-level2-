import express from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidation } from "./user.validate";

const router = express.Router();
// Route: /api/auth/signup (POST)
router.post(
  "/signup",
  //   auth(USER_ROLE.admin),
  validateRequest(userValidation.userValidationSchema),
  UserControllers.createUser
);

// Route: /api/auth/login(POST)
router.post("/login", UserControllers.loginUser);

export const UserRoutes = router;
