import { matchedData } from "express-validator";
import { CategoryModel } from "../models/category.model.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminOrOwnerMiddleware } from "../middlewares/ownerOrAdmin.middleware.js";
import {
  idValidation,
  validationPostEvent,
  validationPutEvent,
} from "../middlewares/validaciones/events.validation.js";
import { validate } from "../middlewares/validaciones/validate.js";
import { EventModel } from "../models/event.model.js";

export const postCategory = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const category = await CategoryModel.create(data);
    return res.status(201).json({ ok: true, body: category });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Error al querer crear la categoria",
    });
  }
};

export const getCategorys = async (req, res) => {
  try {
    const categorys = await CategoryModel.find();
    return res.status(200).json({ ok: true, body: categorys });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Error al buscar las categorys",
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(409).json({
        ok: false,
        message: "no se encontro una category con la id ingresada",
      });
    }
    return res.status(200).json({ ok: true, body: category });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Error al buscar la category",
    });
  }
};

export const putCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const update = matchedData(req, { locations: ["body"] });

    const category = await CategoryModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({
        ok: false,
        message: "Categoría no encontrada",
      });
    }

    return res.status(200).json({ ok: true, body: category });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Error al querer actualizar la categoria",
    });
  }
};

export const deleteCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        ok: false,
        message: "Categoría no encontrada",
      });
    }
    await EventModel.updateMany(
      { categories: id },
      { $pull: { categories: id } },
    );
    await category.deleteOne();
    return res
      .status(200)
      .json({ ok: true, message: "eliminacion exitosa", body: category });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Error al querer eliminar la categoria",
    });
  }
};
