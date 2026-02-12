const z = require("zod");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { setUser } = require("../services/auth");
const { RegisterFormSchema, LoginFormSchema } = require("../lib/schema");

const BCRYPT_SALT_ROUNDS = 10;

async function handleUserSignup(req, res, next) {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    RegisterFormSchema.parse({ fullName, email, password, confirmPassword });

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    await User.create({
      name: fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).redirect("/login");
  } catch (error) {
    console.log("error: ", error);

    if (error instanceof z.ZodError) {
      return res.status(400).render("signup", {
        zodErrors: JSON.parse(error),
      });
    }

    return res.status(500).render("internal-server-error");
  }
}

async function handleUserLogin(req, res, next) {
  const { email, password } = req.body;

  try {
    LoginFormSchema.parse({ email, password });

    const user = await User.findOne({ email });

    // send a custom error in the same format as zod
    if (!user) {
      return res.status(401).render("login", {
        zodErrors: [
          {
            code: "custom",
            path: ["email"],
            message: "Invalid email or password",
          },
        ],
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).render("login", {
        zodErrors: [
          {
            code: "custom",
            path: ["email"],
            message: "Invalid email or password",
          },
        ],
      });
    }

    const token = setUser(user);

    res.cookie("short-url-jwt", token);

    return res.redirect("/");
  } catch (error) {
    console.log("error: ", error);

    if (error instanceof z.ZodError) {
      return res.status(400).render("login", {
        zodErrors: JSON.parse(error),
      });
    }

    return res.status(500).render("internal-server-error");
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
