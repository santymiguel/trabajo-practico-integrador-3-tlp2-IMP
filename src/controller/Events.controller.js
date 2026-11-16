import { matchedData } from "express-validator";
import { EventModel } from "../models/event.model.js";
import { CategoryModel } from "../models/category.model.js";

export const postEvent = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    const { categories = [], ...eventData } = data;
    const uniqueCategories = [];

    // Verificar que las categorías existan

    if (categories.length > 0) {
      uniqueCategories = [
        ...new Map(categories.map((id) => [id.toString(), id])).values(),
      ];
      if (uniqueCategories.length > 0) {
        const categoriesCount = await CategoryModel.countDocuments({
          _id: { $in: uniqueCategories },
        });

        if (categoriesCount !== uniqueCategories.length) {
          return res.status(400).json({
            ok: false,
            message: "Una o más categorías no existen",
          });
        }
      }
    }

    // Crear el evento
    const event = await EventModel.create({
      ...eventData,
      organizer: req.user.id,
      categories: uniqueCategories,
    });

    await event.populate("categories");

    return res.status(201).json({
      ok: true,
      message: "Evento creado correctamente",
      body: event,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: "Error al crear el evento",
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await EventModel.find().populate("organizer categories");
    return res.status(200).json({ ok: true, body: events });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Error al buscar los eventos",
    });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const user_id = req.user.id;
    const events = await EventModel.find({ organizer: user_id }).populate(
      "organizer categories",
    );
    return res.status(200).json({ ok: true, body: events });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Error al buscar los eventos",
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event_id = req.params.id;
    const event = await EventModel.findById(event_id).populate(
      "organizer categories",
    );
    if (!event) {
      return res.status(404).json({
        ok: false,
        message: "Evento no encontrado",
      });
    }
    return res.status(200).json({ ok: true, body: event });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Error al buscar los eventos",
    });
  }
};

export const putEvent = async (req, res) => {
  try {
    const id = req.params.id;

    const data = matchedData(req, { locations: ["body"] });
    const event = await EventModel.findById(id);
    const { categories = [], ...eventData } = data;

    event.set(eventData);

    if (categories.length > 0) {
      let allCategories = [...event.categories, ...categories];

      // Verificar que las categorías existan y que no haya duplicados
      const uniqueCategories = [
        ...new Map(allCategories.map((id) => [id.toString(), id])).values(),
      ];
      if (uniqueCategories.length > 0) {
        const categoriesCount = await CategoryModel.countDocuments({
          _id: { $in: uniqueCategories },
        });

        if (categoriesCount !== uniqueCategories.length) {
          return res.status(400).json({
            ok: false,
            message: "Una o más categorías no existen",
          });
        }
      }
      event.categories = uniqueCategories;
    }

    // Crear el evento
    await event.save();
    await event.populate("categories");

    return res.status(200).json({
      ok: true,
      message: "Evento actualizado correctamente",
      body: event,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: "Error al querer actualizar el evento",
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const id = req.params.id;

    const event = await EventModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!event) {
      return res.status(404).json({
        ok: false,
        message: "Evento no encontrado",
      });
    }

    await EventModel.findByIdAndDelete(id);

    return res.status(200).json({
      ok: true,
      message: "Evento eliminado correctamente",
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Error al eliminar el evento",
    });
  }
};
