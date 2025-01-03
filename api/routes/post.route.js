import express from "express";
import {verifyToken} from "../middleware/verifyToken.js";
import { addPost, deletePost, getPost, getPosts, updatePost,updatePostStatus, 
    updatePostLook, getUserPosts,getFilterPosts, updatePostBuyStatus,updatePostRentStatus,updatePostBuyRentStatus } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/full/", getFilterPosts);
router.get("/:id", getPost);
router.get("/user/:id", getUserPosts);
//router.get("/user/", getAllPosts);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.patch("/:id", verifyToken, updatePostStatus);
router.patch("/search/:id", verifyToken, updatePostLook);
router.patch("/buy/:id", verifyToken, updatePostBuyStatus);
router.patch("/rent/:id", verifyToken, updatePostRentStatus);
router.patch("/type/:id", verifyToken, updatePostBuyRentStatus);

export default router;
