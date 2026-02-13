const { Router } = require("express");
const bcrypt = require("bcrypt");
const z = require("zod");

const User = require("../models/user");
const { RegisterFormSchema, LoginFormSchema } = require("../lib/schema");
const { createTokenForUser } = require("../services/authentication");
const { JWT_TOKEN_NAME } = require("../lib/constants");

const router = Router();

const BCRYPT_SALT_ROUNDS = 10;

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    LoginFormSchema.parse({ email, password });

    const user = await User.findOne({ email });

    // send a custom error in the same format as zod
    if (!user) {
      return res.status(401).render("signin", {
        zodErrors: [
          {
            code: "custom",
            path: ["email"],
            message: "Invalid email or password",
          },
        ],
      });
    }

    // if using `node:crypto` library to hash password
    // const token = await User.matchPasswordAndGenerateToken(email, password);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).render("signin", {
        zodErrors: [
          {
            code: "custom",
            path: ["email"],
            message: "Invalid email or password",
          },
        ],
      });
    }

    const token = createTokenForUser(user);

    res.cookie(JWT_TOKEN_NAME, token);

    return res.redirect("/");
  } catch (error) {
    console.log("error: ", error);

    if (error instanceof z.ZodError) {
      return res.status(400).render("signin", {
        zodErrors: JSON.parse(error),
      });
    }

    return res.status(500).render("internal-server-error");
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    RegisterFormSchema.parse({ fullName, email, password, confirmPassword });

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).redirect("/signin");
  } catch (error) {
    console.log("error: ", error);

    if (error instanceof z.ZodError) {
      return res.status(400).render("signup", {
        zodErrors: JSON.parse(error),
      });
    }

    return res.status(500).render("internal-server-error");
  }
});

router.get("/logout", (req, res) => {
  // clear the cookie
  res.clearCookie(JWT_TOKEN_NAME).redirect("/");
});

module.exports = router;
