const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const verifyToken = require("../verifyToken");

// CREATE
router.post("/create", verifyToken, async (req, res) => {
  try {
    console.log("Attempting to create a new comment with data:", req.body);
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    console.log("Comment created:", savedComment);
    res.status(200).json(savedComment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    console.log("Attempting to update comment with ID:", req.params.id);
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    console.log("Comment updated:", updatedComment);
    res.status(200).json(updatedComment);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    console.log("Attempting to delete comment with ID:", req.params.id);
    await Comment.findByIdAndDelete(req.params.id);
    console.log("Comment has been deleted!");
    res.status(200).json("Comment has been deleted!");
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json(err);
  }
});

// GET POST COMMENTS
router.get("/post/:postId", async (req, res) => {
  try {
    console.log("Fetching comments for post with ID:", req.params.postId);
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json(err);
  }
});

module.exports = router;
