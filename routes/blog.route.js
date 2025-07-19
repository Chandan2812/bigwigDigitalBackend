const router = require("express").Router();
const {
  newBlogPost,
  getBlog,
  getBlogsByCategory,
  updateBlogPostBySlug,
  deleteBlogPostBySlug,
} = require("../controllers/blog.controller");
const multer = require("multer");

const storage = require("../config/storage");
const upload = multer({ storage });

router.post("/add", upload.single("coverImage"), newBlogPost);
router.get("/viewblog", getBlog);
router.get("/category/:categoryName", getBlogsByCategory);

router.put("/:slug", upload.single("coverImage"), updateBlogPostBySlug);
router.delete("/:slug", deleteBlogPostBySlug);

module.exports = router;
