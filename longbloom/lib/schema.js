const z = require("zod");

// Source -> https://github.com/colinhacks/zod/discussions/3412#discussioncomment-9916377
const passwordSchema = z
  .string()
  .min(8, { error: "Password should at least be 8 characters long" })
  .max(24, { error: "Password cannot be more than 24 characters" })
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

const RegisterFormSchema = z
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

const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: passwordSchema,
});

const CreateBlogFormSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(10, {
      error: "Title should at least be 10 characters long",
    })
    .max(70, {
      error: "Title cannot be more than 70 characters",
    }),
  description: z
    .string({
      error: "Description is required",
    })
    .min(70, {
      error: "Description should at least be 70 characters long",
    })
    .max(500, {
      error: "Description cannot be more than 500 characters",
    }),
  slug: z
    .string({
      error: "Slug is required",
    })
    .min(3, {
      error: "Slug should at least be 3 characters long",
    })
    .max(70, {
      error: "Slug cannot be more than 70 characters",
    }),
  coverImage: z.string().optional(),
});

module.exports = {
  RegisterFormSchema,
  LoginFormSchema,
  CreateBlogFormSchema,
};
