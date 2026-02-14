const { Router } = require("express");
const z = require("zod");
const mongoose = require("mongoose");

const Blog = require("../models/blog");
const { CreateBlogFormSchema } = require("../lib/schema");

const router = Router();

router.get("/create", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/create", async (req, res) => {
  const { title, description, slug, coverImage } = req.body;

  try {
    CreateBlogFormSchema.parse({ title, description, slug, coverImage });

    await Blog.create({
      title,
      description,
      slug,
      coverImageURL: coverImage,
      createdBy: req.user._id,
    });

    return res.status(201).render("home", {
      submissionStatus: {
        statusCode: 201,
        message: "successful",
      },
    });
  } catch (error) {
    console.log("error: ", error);

    if (error instanceof z.ZodError) {
      return res.status(400).render("addBlog", {
        zodErrors: JSON.parse(error),
      });
    } else if (error.code === 11000) {
      return res.status(400).render("addBlog", {
        zodErrors: [
          {
            code: "custom",
            path: ["slug"],
            message: "A blog with the same slug already exists",
          },
        ],
      });
    }

    return res.status(500).render("internal-server-error");
  }
});

module.exports = router;
