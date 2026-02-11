const path = require("path");
const express = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const app = express();

const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middleware to parse form data
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  return res.render("homepage");
});

app.post("/upload", upload.single("profileImage"), (req, res, next) => {
  console.log("req.body: ", req.body);
  console.log("req.file: ", req.file);

  return res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
