import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import {
  idValidation,
  postCategoryValidation,
  putCategoryValidation,
} from "../middlewares/validaciones/category.validation.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validaciones/validate.js";
import {
  deleteCategoryById,
  getCategoryById,
  getCategorys,
  postCategory,
  putCategory,
} from "../controller/Category.controller.js";

export const categoryRouter = Router();

categoryRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  postCategoryValidation,
  validate,
  postCategory,
);

categoryRouter.get("/", authMiddleware, getCategorys);

categoryRouter.get(
  "/:id",
  authMiddleware,
  idValidation,
  validate,
  getCategoryById,
);

categoryRouter.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  putCategoryValidation,
  validate,
  putCategory,
);

categoryRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  idValidation,
  validate,
  deleteCategoryById,
);
