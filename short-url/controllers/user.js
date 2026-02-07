const { v4: uuidv4 } = require("uuid");
const z = require("zod");

const User = require("../models/user");
const { setUser } = require("../services/auth");
const { RegisterFormSchema, LoginFormSchema } = require("../lib/schema");

async function handleUserSignup(req, res, next) {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    RegisterFormSchema.parse({ fullName, email, password, confirmPassword });

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

  try {
    LoginFormSchema.parse({ email, password });

    const user = await User.findOne({ email, password });

    // send a custom error in the same format as zod
    if (!user) {
      return res.render("login", {
        zodErrors: [
          {
            code: "custom",
            path: ["email"],
            message: "Invalid email or password",
          },
        ],
      });
    }

    const sessionId = uuidv4();

    setUser(sessionId, user);

    res.cookie("short-url-uid", sessionId);

    return res.redirect("/");
  } catch (error) {
    console.log("error: ", error);

    if (error instanceof z.ZodError) {
      return res.status(400).render("login", {
        zodErrors: JSON.parse(error),
      });
    }

    return res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
