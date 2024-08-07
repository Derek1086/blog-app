const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const verifyToken = require("../verifyToken");

// UPDATE User (username and email)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if username is already taken by another user
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername && existingUsername._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Check if email is already taken by another user
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail && existingEmail._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Email already taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // Update username in all posts associated with the user
    await Post.updateMany(
      { userId: req.params.id },
      { $set: { username: updatedUser.username } }
    );

    console.log(
      `Updated Username: ${updatedUser.username}, Updated Email: ${updatedUser.email}`
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE Password
router.put("/password/:id", verifyToken, async (req, res) => {
  try {
    const { password } = req.body;

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    console.log(`Updated Password for User: ${updatedUser.username}`);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// VERIFY Password
router.put("/password/verify/:id", verifyToken, async (req, res) => {
  const { currentPassword } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    console.log("Password verified successfully");
    res.status(200).json({ message: "Password verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE User
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Post.deleteMany({ userId: req.params.id });
    await Comment.deleteMany({ userId: req.params.id });
    console.log("User and their posts/comments has been deleted!");
    res.status(200).json("User has been deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET User by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET User Favorites
router.get("/:id/favorites", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    const favoritePosts = await Post.find({ _id: { $in: user.favorites } });
    res.status(200).json(favoritePosts);
  } catch (err) {
    console.error("Error fetching user's favorites:", err);
    res.status(500).json(err);
  }
});

// GET User Post History
router.get("/:id/history", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.posthistory);
  } catch (err) {
    console.error("Error fetching user's post history:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE User History
router.delete("/:id/history", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    user.posthistory = [];
    await user.save();

    console.log("User's post history has been cleared!");
    res.status(200).json({ message: "Post history cleared successfully" });
  } catch (err) {
    console.error("Error clearing user's post history:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add to User Search History
router.put("/:id/searchhistory", async (req, res) => {
  try {
    const userId = req.params.id;
    const { searchQuery } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    if (!searchQuery) {
      return res.status(400).json({ error: "Search term is required" });
    }

    // Remove searchQuery if it already exists in user.searchHistory
    const index = user.searchHistory.indexOf(searchQuery);
    if (index !== -1) {
      user.searchHistory.splice(index, 1);
    }

    user.searchHistory.push(searchQuery);

    await user.save();
    res.status(200).json({
      message: "Search history updated",
      searchHistory: user.searchHistory,
    });
  } catch (err) {
    console.error("Error updating user's search history:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET User Search History
router.get("/:id/searchhistory", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    const searchHistory = user.searchHistory;
    res.status(200).json(searchHistory);
  } catch (err) {
    console.error("Error fetching user's search history:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE User Search History
router.delete("/:id/searchhistory", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    user.searchHistory = [];
    await user.save();
    res.status(200).json({ message: "Search history cleared successfully" });
  } catch (err) {
    console.error("Error clearing user's post history:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET createdAt by username
router.get("/createdAt/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ createdAt: user.createdAt });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
