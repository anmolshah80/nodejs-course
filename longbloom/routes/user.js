const { createHmac } = require("node:crypto");
const { Router } = require("express");
const z = require("zod");

const User = require("../models/user");
const { RegisterFormSchema, LoginFormSchema } = require("../lib/schema");

const router = Router();

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

    // Source -> https://nodejs.org/api/crypto.html#crypto
    const hashedPassword = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    if (user.password !== hashedPassword) {
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

    // const token = setUser(user);

    // res.cookie("longbloom-jwt", token);

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
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    RegisterFormSchema.parse({ fullName, email, password, confirmPassword });

    await User.create({
      fullName,
      email,
      password,
    });

    return res.status(201).redirect("/signin");
  } catch (error) {
    console.log("error: ", error);

    if (error instanceof z.ZodError) {
      return res.status(400).render("signup", {
        zodErrors: JSON.parse(error),
      });
    }

    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
