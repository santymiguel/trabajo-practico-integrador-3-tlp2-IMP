import { body, param } from "express-validator";
import { EventModel } from "../../models/event.model.js";
import mongoose from "mongoose";

export const validationPostEvent = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
    .bail()
    .custom(async (title) => {
      const titleExistente = await EventModel.findOne({ title: title });
      if (titleExistente) {
        throw new Error("El titulo ya esta en uso");
      }
    }),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .bail()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("startDate")
    .notEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("La fecha de inicio no es válida"),

  body("endDate")
    .notEmpty()
    .withMessage("La fecha de finalización es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("La fecha de finalización no es válida")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error(
          "La fecha de finalización debe ser posterior a la de inicio",
        );
      }
      return true;
    }),

  body("capacity")
    .notEmpty()
    .withMessage("La capacidad es obligatoria")
    .bail()
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero mayor o igual a 1"),

  body("price")
    .optional({ values: "null" })
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser mayor o igual a 0"),

  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("El estado no es válido"),

  body("categories")
    .optional()
    .isArray()
    .withMessage("Las categorías deben ser un array")
    .bail()
    .custom((categories) => {
      if (!categories.every((id) => mongoose.isValidObjectId(id))) {
        throw new Error("Las categorías deben contener IDs válidos de MongoDB");
      }
      return true;
    }),

  body("location.venue")
    .trim()
    .notEmpty()
    .withMessage("El lugar es obligatorio")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),

  body("location.address")
    .trim()
    .notEmpty()
    .withMessage("La dirección es obligatoria")
    .bail()
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),

  body("location.city")
    .trim()
    .notEmpty()
    .withMessage("La ciudad es obligatoria")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),
];

export const validationPutEvent = [
  param("id")
    .isMongoId()
    .withMessage("El ID del evento no tiene un formato válido")
    .custom(async (id) => {
      const event = await EventModel.findById(id);
      if (!event) {
        throw new Error("la id ingresada no corresponde a ningun evento");
      }
    })
    .bail({ level: "request" }),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
    .bail()
    .custom(async (title, { req }) => {
      const titleExistente = await EventModel.findOne({
        title: title,
        _id: { $ne: req.params.id },
      });
      if (titleExistente) {
        throw new Error("El titulo ya esta en uso");
      }
    }),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .bail()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("startDate")
    .optional()
    .notEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("La fecha de inicio no es válida")
    .custom(async (startDate, { req }) => {
      const event = await EventModel.findById(req.params.id);
      const endDate = req.body.endDate || event.endDate;
      if (new Date(startDate) >= new Date(endDate)) {
        throw new Error(
          "La fecha de inicio debe ser anterior a la de finalizacion",
        );
      }

      return true;
    }),

  body("endDate")
    .optional()
    .notEmpty()
    .withMessage("La fecha de finalización es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("La fecha de finalización no es válida")
    .custom(async (endDate, { req }) => {
      const event = await EventModel.findById(req.params.id);
      const startDate = req.body.startDate || event.startDate;
      if (new Date(endDate) <= new Date(startDate)) {
        throw new Error(
          "La fecha de finalización debe ser posterior a la de inicio",
        );
      }

      return true;
    }),

  body("capacity")
    .optional()
    .notEmpty()
    .withMessage("La capacidad es obligatoria")
    .bail()
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero mayor o igual a 1"),

  body("price")
    .optional({ values: "null" })
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser mayor o igual a 0"),

  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("El estado no es válido"),

  body("categories")
    .optional()
    .isArray()
    .withMessage("Las categorías deben ser un array")
    .bail()
    .custom((categories) => {
      if (!categories.every((id) => mongoose.isValidObjectId(id))) {
        throw new Error("Las categorías deben contener IDs válidos de MongoDB");
      }
      return true;
    }),
  body("location")
    .optional()
    .isObject()
    .withMessage("La ubicación debe ser un objeto")
    .bail()
    .custom((location) => {
      if (
        typeof location.venue !== "string" ||
        location.venue.trim().length < 3 ||
        location.venue.trim().length > 100
      ) {
        throw new Error("El lugar debe tener entre 3 y 100 caracteres");
      }

      if (
        typeof location.address !== "string" ||
        location.address.trim().length < 5 ||
        location.address.trim().length > 150
      ) {
        throw new Error("La dirección debe tener entre 5 y 150 caracteres");
      }

      if (
        typeof location.city !== "string" ||
        location.city.trim().length < 2 ||
        location.city.trim().length > 50
      ) {
        throw new Error("La ciudad debe tener entre 2 y 50 caracteres");
      }

      return true;
    }),
];

export const idValidation = [
  param("id")
    .isMongoId()
    .withMessage("El ID del evento no tiene un formato válido"),
];
