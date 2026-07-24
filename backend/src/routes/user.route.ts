import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPasswordByAdmin,
  requestPasswordResetByUser,
  resetPasswordByUser,
  getPaginatedUsers,
} from "../controllers/user.controller";

const router = Router();

router.post("/forgot-password", requestPasswordResetByUser);
router.patch("/reset-password", resetPasswordByUser);

router.get("/", authMiddleware, getAllUsers, allowRoles("admin"));
router.get(
  "/paginated",
  authMiddleware,
  getPaginatedUsers,
  allowRoles("admin"),
);
router.post("/", authMiddleware, createUser, allowRoles("admin"));
router.put("/:id", authMiddleware, updateUser, allowRoles("admin"));
router.delete("/:id", authMiddleware, deleteUser, allowRoles("admin"));
router.patch(
  "/:id/reset-password",
  authMiddleware,
  resetPasswordByAdmin,
  allowRoles("admin"),
);

export default router;
