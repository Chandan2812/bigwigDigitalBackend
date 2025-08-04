const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String, // Just the name, no avatar
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Search Engine Optimization",
      "Social Media Marketing",
      "Performance Marketing",
      "Content Marketing",
      "Website Designing & Development",
      "Email Marketing",
      "Social Media Optimization",
      "Graphic Designing",
      "AI and CGI Marketing",
      "Landing Page Optimization",
      "Affiliate Marketing",
      "Video Shoot",
      "Public Relations",
      "Influencer Marketing",
      "Online Reputation Management",
      "Digital Marketing",
    ],
    default: "Digital Marketing",
  },

  likes: {
    type: Number,
    default: 0,
  },
  schemaMarkup: {
    type: [String], // array of JSON-LD strings
    default: [],
  },

  datePublished: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
