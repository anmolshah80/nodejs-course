const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const userRoute = require("./routes/user");

const app = express();

const PORT = 8000;

mongoose
  .connect("mongodb://localhost:27017/longbloom")
  .then(() => console.log("MongoDb connected!"))
  .catch((error) => console.log("Error connecting to MongoDb: ", error));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
// Source - https://stackoverflow.com/a/32303676
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoute);

app.get("/", (req, res, next) => {
  res.render("home");
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`),
);
