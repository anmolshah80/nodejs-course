const path = require("path");
const express = require("express");

const app = express();

const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Source - https://stackoverflow.com/a/32303676
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  res.render("home");
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`),
);
