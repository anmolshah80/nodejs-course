const { Router } = require("express");
const z = require("zod");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Blog = require("../models/blog");
const { CreateBlogFormSchema } = require("../lib/schema");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // define the path to the user's directory
    const userDir = path.join("./public/uploads", req.user._id);

    // create the directory if it doesn't exist
    fs.mkdirSync(userDir, { recursive: true });

    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-cover-${file.originalname}`;

    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/create", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/create", upload.single("coverImage"), async (req, res) => {
  const { title, description, slug, coverImage } = req.body;

  console.log("req.body: ", req.body);
  console.log("req.file: ", req.file);

  // 5 MB -> 5242880 bytes
  if (req.file?.size > 5242880) {
    return res.status(400).render("signup", {
      zodErrors: [
        {
          code: "custom",
          path: ["coverImage"],
          message: "Cover image size should be less than 5 MB",
        },
      ],
    });
  }

  try {
    CreateBlogFormSchema.parse({ title, description, slug, coverImage });

    await Blog.create({
      title,
      description,
      slug,
      coverImageURL: req.file
        ? `uploads/${req.user._id}/${req.file.filename}`
        : undefined,
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
