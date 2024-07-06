const post = require("../models/postModel");
/**
 * Fetch all posts from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void}
 */
exports.getAllPosts = async (req, res, next) => {
  await post
    .find()
    .then((posts) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        data: { posts },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

/**
 * Fetches a single post from the database based on the provided ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void}
 *
 * @throws Will throw an error if the post ID is not provided in the request parameters.
 * @throws Will throw an error if the post is not found in the database.
 *
 * @example
 * // Request: GET /posts/5f1771c112d83640ec123456
 * // Response:
 * {
 *   "message": "Post fetched successfully",
 *   "data": {
 *     "post": {
 *       "_id": "5f1771c112d83640ec123456",
 *       "title": "Sample Post",
 *       "body": "This is a sample post.",
 *       // ... other post fields
 *     }
 *   }
 * }
 */
exports.getOnePost = async (req, res, next) => {
  const postId = req.params.id; // Assuming the post ID is passed as a parameter in the request URL

  if (!postId) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  await post
    .findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.status(200).json({
        message: "Post fetched successfully",
        data: { post },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

/**
 * Creates a new post in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void}
 *
 * @throws Will throw an error if the required post data is not provided in the request body.
 * @throws Will throw an error if the post creation fails in the database.
 *
 * @example
 * // Request: POST /posts
 * // Request Body:
 * {
 *   "title": "Sample Post",
 *   "body": "This is a sample post.",
 *   // ... other post fields
 * }
 * // Response:
 * {
 *   "message": "Post created successfully",
 *   "data": {
 *     "post": {
 *       "_id": "5f1771c112d83640ec123456",
 *       "title": "Sample Post",
 *       "body": "This is a sample post.",
 *       // ... other post fields
 *     }
 *   }
 * }
 */
exports.createPost = async (req, res, next) => {
  const { title, body } = req.body; // Assuming the required fields are title and body

  if (!title || !body) {
    return res.status(400).json({ error: "Title and body are required" });
  }

  const newPost = new post({ title, body });

  await newPost
    .save()
    .then((post) => {
      res.status(201).json({
        message: "Post created successfully",
        data: { post },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

/**
 * Updates a post in the database based on the provided ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void}
 *
 * @throws Will throw an error if the post ID is not provided in the request parameters.
 * @throws Will throw an error if the post is not found in the database.
 * @throws Will throw an error if the required post data is not provided in the request body.
 * @throws Will throw an error if the post update fails in the database.
 *
 * @example
 * // Request: PATCH /posts/5f1771c112d83640ec123456
 * // Request Body:
 * {
 *   "title": "Updated Sample Post",
 *   "body": "This is an updated sample post.",
 *   // ... other post fields
 * }
 * // Response:
 * {
 *   "message": "Post updated successfully",
 *   "data": {
 *     "post": {
 *       "_id": "5f1771c112d83640ec123456",
 *       "title": "Updated Sample Post",
 *       "body": "This is an updated sample post.",
 *       // ... other post fields
 *     }
 *   }
 * }
 */
exports.updatePost = async (req, res, next) => {
  const postId = req.params.id; // Assuming the post ID is passed as a parameter in the request URL
  const { title, body } = req.body; // Assuming the required fields are title and body

  if (!postId) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  if (!title && !body) {
    return res.status(400).json({ error: "Title and body are required" });
  }

  await post
    .findByIdAndUpdate(
      postId,
      { title, body },
      { new: true, runValidators: true }
    )
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.status(200).json({
        message: "Post updated successfully",
        data: { post: updatedPost },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

/**
 * Deletes a post from the database based on the provided ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void}
 *
 * @throws Will throw an error if the post ID is not provided in the request parameters.
 * @throws Will throw an error if the post is not found in the database.
 * @throws Will throw an error if the post deletion fails in the database.
 *
 * @example
 * // Request: DELETE /posts/5f1771c112d83640ec123456
 * // Response:
 * {
 *   "message": "Post deleted successfully",
 * }
 */
exports.deletePost = async (req, res, next) => {
  const postId = req.params.id; // Assuming the post ID is passed as a parameter in the request URL

  if (!postId) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  await post
    .findByIdAndDelete(postId)
    .then((deletedPost) => {
      if (!deletedPost) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.status(200).json({
        message: "Post deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
