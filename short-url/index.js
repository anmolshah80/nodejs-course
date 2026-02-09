const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const { restrictToLoggedInUserOnly, checkAuth } = require("./middlewares/auth");

const URL = require("./models/url");

const { connectToMongoDB } = require("./connect");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();

const PORT = process.env.PORT || 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("MongoDb connected!"))
  .catch((err) => console.log("MongoDb connection error: ", err));

app.set("view engine", "ejs");

app.set("views", path.resolve("./views"));

// to parse form data
app.use(express.urlencoded({ extended: false }));
// to parse json data
app.use(express.json());
app.use(cookieParser());

app.use("/", checkAuth, staticRoute);
app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute);

app.get("/url/:shortId", async (req, res) => {
  const { shortId } = req.params;

  if (!shortId)
    return res
      .status(400)
      .json({ error: "a valid shortId needs to be provided" });

  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
  );

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
