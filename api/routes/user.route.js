import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
  getNotificationNumber,
  updateUserLook ,
  updateUserStatus,
  getUserStats,
  updateUserRole
} from "../controllers/user.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/search/:id",verifyToken, getUser);
router.put("/:id",verifyToken, updateUser);
router.patch("/search/:id",verifyToken, updateUserLook );
router.patch("/status/:id",verifyToken, updateUserStatus );
router.delete("/:id",verifyToken, deleteUser);
router.post("/save",verifyToken, savePost);
router.get("/profilePosts",verifyToken, profilePosts);
router.get("/notification",verifyToken, getNotificationNumber);
router.get("/stats/users",verifyToken, getUserStats);
router.patch("/role/:id",verifyToken, updateUserRole );

export default router;
