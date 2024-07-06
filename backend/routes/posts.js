const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const verifyToken = require("../verifyToken");

// CREATE
router.post("/create", verifyToken, async (req, res) => {
  try {
    console.log("Attempting to create a new post with data:", req.body);
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();

    // Log the title of the post created
    console.log("Post created:", savedPost.title);

    res.status(200).json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    console.log("Attempting to update post with ID:", req.params.id);
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log("Post not found with ID:", req.params.id);
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if there is a new photo uploaded
    if (req.body.photo && req.body.photo !== post.photo) {
      if (post.photo) {
        const photoPath = path.join(__dirname, `../images/${post.photo}`);
        fs.unlinkSync(photoPath);
        console.log(
          post.photo +
            " has been replaced in the filesystem with " +
            req.body.photo
        );
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    console.log("Post updated:", updatedPost);
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    console.log("Attempting to delete post with ID:", req.params.id);
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log("Post not found with ID:", req.params.id);
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the post has a photo and delete it from filesystem
    if (post.photo) {
      const photoPath = path.join(__dirname, `../images/${post.photo}`);
      fs.unlinkSync(photoPath);
      console.log(post.photo + " has been deleted from the filesystem.");
    }

    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: req.params.id });
    console.log(
      "Post " + post.title + " and associated comments have been deleted!"
    );
    res.status(200).json("Post and associated comments have been deleted!");
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json(err);
  }
});

// GET Post Details and Update View Count
router.get("/:id", verifyToken, async (req, res) => {
  try {
    console.log("Fetching details for post with ID:", req.params.id);
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userId = req.userId;
    console.log("User ID:", userId, "is viewing post ID:", req.params.id);

    // Ensure the user hasn't already viewed this post
    if (!post.viewedBy.includes(userId)) {
      const randomIncrement = Math.floor(Math.random() * 100000000) + 1;
      post.viewCount += randomIncrement;
      post.viewedBy.push(userId);
      await post.save();
    } else {
      console.log("User has already viewed this post");
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post details:", err);
    res.status(500).json(err);
  }
});

// GET POSTS
router.get("/", async (req, res) => {
  const query = req.query;

  try {
    if (Object.keys(query).length !== 0) {
      console.log("Fetching posts with query:", query);
    }
    const searchFilter = {
      title: { $regex: query.search, $options: "i" },
    };
    const posts = await Post.find(query.search ? searchFilter : null);
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json(err);
  }
});

// GET USER POSTS
router.get("/user/:userId", async (req, res) => {
  try {
    console.log("Fetching posts for user with ID:", req.params.userId);
    const posts = await Post.find({ userId: req.params.userId });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json(err);
  }
});

// UPDATE FAVORITE COUNT
router.post("/:id/favorite", verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    console.log(
      "User ID:",
      userId,
      "is attempting to favorite post ID:",
      postId
    );

    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found with ID:", postId);
      return res.status(404).json({ error: "Post not found" });
    }

    const userFavorited = post.favoritedBy.includes(userId);
    if (userFavorited) {
      console.log("User ID:", userId, "is unfavoriting post ID:", postId);
      post.favoriteCount -= 1;
      post.favoritedBy = post.favoritedBy.filter((id) => id !== userId);
    } else {
      console.log("User ID:", userId, "is favoriting post ID:", postId);
      post.favoriteCount += 1;
      post.favoritedBy.push(userId);
    }
    await post.save();

    console.log(
      "Favorite count for post ID:",
      postId,
      "is now:",
      post.favoriteCount
    );

    res.status(200).json(post);
  } catch (err) {
    console.error("Error updating favorite count:", err);
    res.status(500).json(err);
  }
});

module.exports = router;
