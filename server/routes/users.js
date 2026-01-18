import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  login,
  updateUser,
  getProfile,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post("/", createUser);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
