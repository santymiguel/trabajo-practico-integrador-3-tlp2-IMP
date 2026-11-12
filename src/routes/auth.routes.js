import { Router } from "express";
import { register } from "../controller/controllerAutenticacion/controller.postRegister.js";
import { login } from "../controller/controllerAutenticacion/controller.postLogin.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getProfile } from "../controller/controllerAutenticacion/controller.getProfile.js";
import { updateProfile } from "../controller/controllerAutenticacion/controller.putProfile.js";
import { logout } from "../controller/controllerAutenticacion/controller.postLogout.js";
import {
  validationLogin,
  validationPutProfile,
  validationRegister,
} from "../middlewares/validaciones/auth.validation.js";
import { validate } from "../middlewares/validaciones/validate.js";

export const authRouter = Router();

authRouter.post("/register", validationRegister, validate, register);
authRouter.post("/login", validationLogin, validate, login);
authRouter.get("/profile", authMiddleware, getProfile);
authRouter.put(
  "/profile",
  authMiddleware,
  validationPutProfile,
  validate,
  updateProfile,
);
authRouter.post("/logout", authMiddleware, logout);
