const BlogPost = require("../modals/blog.modal");
const OpenAI = require("openai");
require("dotenv").config();
// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.newBlogPost = async (req, res) => {
  try {
    const { title, slug, excerpt, content, author, tags, prompt } = req.body;

    if (!req.file || (!req.file.path && !req.file.secure_url)) {
      return res.status(400).json({ error: "Cover image is required." });
    }

    const coverImage = req.file.secure_url || req.file.path;

    let finalContent = content;

    // Use AI only if manual content is not provided
    if (!content && prompt) {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a professional blog writer. Generate high-quality, SEO-friendly blog content in HTML format. Structure the blog with clear sections: an engaging <h2>Introduction</h2>, a detailed <h2>Main Content</h2> with multiple <p> paragraphs, and a concise <h2>Conclusion</h2>. Use proper <p> tags for paragraphs. Do not include a title.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1800,
        temperature: 0.7,
      });

      finalContent = aiResponse.choices[0].message.content;
    }

    if (!finalContent) {
      return res
        .status(400)
        .json({ error: "Either content or prompt must be provided." });
    }

    const blogPost = new BlogPost({
      title,
      slug,
      excerpt,
      content: finalContent,
      author,
      tags,
      coverImage,
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

exports.getBlog = async (req, res) => {
  try {
    const data = await BlogPost.find();
    if (!data || data.length === 0) {
      return res.status(404).json({ msg: "No blog posts found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.log("Error fetching blogs:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.updateBlogPostBySlug = async (req, res) => {
  const { slug } = req.params;
  const { title, content, author, excerpt, tags } = req.body;

  try {
    const updateFields = {
      ...(title && { title }),
      ...(content && { content }),
      ...(author && { author }),
      ...(excerpt && { excerpt }),
      ...(tags && { tags }),
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
