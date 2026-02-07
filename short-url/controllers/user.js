const { v4: uuidv4 } = require("uuid");
const z = require("zod");

const User = require("../models/user");
const { setUser } = require("../services/auth");
const { UserSchema } = require("../lib/schema");

async function handleUserSignup(req, res, next) {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    console.log("req.body: ", req.body);

    UserSchema.parse({ fullName, email, password, confirmPassword });

    // before creating the user, encrypt the password using bcrypt library

    await User.create({
      name: fullName,
      email,
      password,
    });

    return res.status(201).redirect("/");
  } catch (error) {
    console.log("error: ", error);

    if (error instanceof z.ZodError) {
      return res.status(400).render("signup", {
        zodErrors: JSON.parse(error),
      });
    }

    return res.status(500).send("Internal Server Error");
  }
}

async function handleUserLogin(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.render("login", {
      error: "Invalid email or password",
    });
  }

  const sessionId = uuidv4();

  setUser(sessionId, user);

  res.cookie("short-url-uid", sessionId);

  return res.redirect("/");
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
