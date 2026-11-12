import { EventModel } from "../models/event.model.js";

export const adminOrOwnerMiddleware = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        ok: false,
        message: "El ID del evento no es válido",
      });
    }
    const evento = await EventModel.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        message: "Evento no encontrado",
      });
    }

    if (
      req.user.role !== "admin" &&
      evento.organizer.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        ok: false,
        message: "Acceso denegado, No cuenta con los permisos necesarios",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Error al verificar los permisos",
    });
  }
};
