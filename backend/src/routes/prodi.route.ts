import { Router } from "express";
import {
  createProdi,
  deleteProdi,
  getAllProdi,
  getPaginatedProdi,
  updateProdi,
} from "../controllers/prodi.controller";
import { allowRoles } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  allowRoles("admin", "operator", "viewer"),
  getAllProdi,
);

router.get(
  "/",
  authMiddleware,
  allowRoles("admin", "operator", "viewer"),
  getPaginatedProdi,
);

router.post("/", authMiddleware, allowRoles("admin", "operator"), createProdi);
router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin", "operator"),
  updateProdi,
);

router.delete("/:id", authMiddleware, allowRoles("admin"), deleteProdi);

export default router;
