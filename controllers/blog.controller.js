const BlogPost = require("../modals/blog.modal");

// Create new blog post (expects HTML content from React Quill)

exports.newBlogPost = async (req, res) => {
  try {
    const { title, slug, excerpt, content, author, tags, category } = req.body;

    if (!req.file || (!req.file.path && !req.file.secure_url)) {
      return res.status(400).json({ error: "Cover image is required." });
    }

    if (!content || typeof content !== "string") {
      return res
        .status(400)
        .json({ error: "Blog content (HTML) is required." });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({ error: "Category is required." });
    }

    const coverImage = req.file.secure_url || req.file.path;

    const blogPost = new BlogPost({
      title,
      slug,
      excerpt,
      content,
      author,
      category,
      tags: tags?.split(",").map((tag) => tag.trim()),
      coverImage,
      // likes is not passed intentionally — default is 0
    });

    await blogPost.save();

    return res.status(201).json({
      message: "Blog post created successfully.",
      blogPost,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Get all blog posts
exports.getBlog = async (req, res) => {
  try {
    const data = await BlogPost.find().sort({
      datePublished: -1,
    });
    if (!data || data.length === 0) {
      return res.status(404).json({ msg: "No blog posts found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.log("Error fetching blogs:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getBlogsByCategory = async (req, res) => {
  try {
    const categorySlug = req.params.categoryName;
    const categoryName = categorySlug.replace(/-/g, " ");

    const blogs = await BlogPost.find({
      category: new RegExp(`${categoryName}`, "i"),
    }).sort({
      datePublished: -1,
    });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs by category:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update blog post by slug
exports.updateBlogPostBySlug = async (req, res) => {
  const { slug } = req.params;
  const { title, content, author, excerpt, tags, category } = req.body;

  try {
    const updateFields = {
      ...(title && { title }),
      ...(content && { content }),
      ...(author && { author }),
      ...(excerpt && { excerpt }),
      ...(tags && { tags: tags.split(",").map((tag) => tag.trim()) }),
      ...(category && { category }),
      lastUpdated: new Date(),
    };

    if (req.file && (req.file.secure_url || req.file.path)) {
      updateFields.coverImage = req.file.secure_url || req.file.path;
    }

    const updatedBlogPost = await BlogPost.findOneAndUpdate(
      { slug },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedBlogPost) {
      return res.status(404).json({ msg: "Blog post not found" });
    }

    res.status(200).json({
      msg: "Blog post updated successfully",
      blogPost: updatedBlogPost,
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Delete blog post by slug
exports.deleteBlogPostBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const deletedBlogPost = await BlogPost.findOneAndDelete({ slug });

    if (!deletedBlogPost) {
      return res.status(404).json({ msg: "Blog post not found" });
    }

    res.status(200).json({ msg: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};
