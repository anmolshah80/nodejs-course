const z = require("zod");

// Source -> https://github.com/colinhacks/zod/discussions/3412#discussioncomment-9916377
const passwordSchema = z
  .string()
  .min(8, { error: "Password should at least be 8 characters long" })
  .max(16, { error: "Password cannot be more than 16 characters" })
  .refine((password) => /[A-Z]/.test(password), {
    error: "Password should have at least one uppercase character",
  })
  .refine((password) => /[a-z]/.test(password), {
    error: "Password should have at least one lowercase character",
  })
  .refine((password) => /[0-9]/.test(password), {
    error: "Password should have at least one number",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    error: "Password should have at least one special character (!@#$%^&*)",
  });

const UrlSchema = z.object({
  url: z
    .url()
    .refine((val) => val.startsWith("http://") || val.startsWith("https://"), {
      error: "URL must start with http:// or https://",
    }),
});

const UserSchema = z
  .object({
    fullName: z
      .string({ error: "Full name is required" })
      .min(1, { error: "Please enter your full name" })
      .max(70, {
        error: "Name cannot be more than 70 characters",
      }),
    email: z.email({ error: "Please enter a valid email address" }),
    password: passwordSchema,
    confirmPassword: z
      .string({ error: "Confirm password is required" })
      .min(1, { error: "Confirm password cannot be empty" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password and confirm password do not match",
    path: ["confirmPassword"],
  });

module.exports = {
  UrlSchema,
  UserSchema,
};
