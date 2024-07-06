const express = require("express");
// Import the required controller functions
const {
  getAllPosts,
  getOnePost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.route("/").get(getAllPosts).post(protect, createPost); // Fetch all posts
router
  .route("/:id")
  .get(getOnePost)
  .patch(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
