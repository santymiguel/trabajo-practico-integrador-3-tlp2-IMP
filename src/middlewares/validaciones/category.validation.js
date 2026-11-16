import { body, param } from "express-validator";
import { CategoryModel } from "../../models/category.model.js";

export const idValidation = [
  param("id")
    .isMongoId()
    .withMessage("El ID del evento no tiene un formato válido"),
];

export const postCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El name es obligatorio")
    .isString()
    .withMessage("El name debe ser una cadena de caracteres")
    .isLength({ min: 2, max: 30 })
    .custom(async (name) => {
      const oldName = await CategoryModel.findOne({ name });
      if (oldName) {
        throw new Error("El name ingresado ya esta en uso");
      }
    }),
  body("description")
    .optional()
    .isString()
    .withMessage("la description debe ser una cadena de caracteres")
    .isLength({ max: 200 }),
];

export const putCategoryValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El name es obligatorio")
    .isString()
    .withMessage("El name debe ser una cadena de caracteres")
    .isLength({ min: 2, max: 30 })
    .custom(async (name, { req }) => {
      const id = req.params.id;
      const oldName = await CategoryModel.findOne({ name, _id: { $ne: id } });
      if (oldName) {
        throw new Error("El name ingresado ya esta en uso");
      }
    }),
  body("description")
    .optional()
    .isString()
    .withMessage("la description debe ser una cadena de caracteres")
    .isLength({ max: 200 }),
];
