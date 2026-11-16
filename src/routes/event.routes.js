import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  idValidation,
  validationPostEvent,
  validationPutEvent,
} from "../middlewares/validaciones/events.validation.js";
import { validate } from "../middlewares/validaciones/validate.js";
import {
  deleteEvent,
  getEventById,
  getEvents,
  getMyEvents,
  postEvent,
  putEvent,
} from "../controller/Events.controller.js";
import { adminOrOwnerMiddleware } from "../middlewares/ownerOrAdmin.middleware.js";

export const eventRouter = Router();

eventRouter.post("/", authMiddleware, validationPostEvent, validate, postEvent);

eventRouter.get("/", authMiddleware, getEvents);
eventRouter.get("/my-events", authMiddleware, getMyEvents);
eventRouter.get("/:id", authMiddleware, idValidation, validate, getEventById);

eventRouter.put(
  "/:id",
  authMiddleware,
  adminOrOwnerMiddleware,
  validationPutEvent,
  validate,
  putEvent,
);

eventRouter.delete(
  "/:id",
  authMiddleware,
  adminOrOwnerMiddleware,
  idValidation,
  validate,
  deleteEvent,
);
