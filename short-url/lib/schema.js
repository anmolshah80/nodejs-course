const z = require("zod");

const passwordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
    anotherField: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],

    // run if password & confirmPassword are valid
    when(payload) {
      return schema
        .pick({ password: true, confirmPassword: true })
        .safeParse(payload.value).success;
    },
  });

// schema.parse({
//   password: "asdf",
//   confirmPassword: "asdf",
//   anotherField: 1234 // ❌ this error will not prevent the password check from running
// });

const UrlSchema = z.object({
  url: z
    .url()
    .refine((val) => val.startsWith("http://") || val.startsWith("https://"), {
      message: "URL must start with http:// or https://",
    }),
});

const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
  passwordSchema,
});

module.exports = {
  UrlSchema,
  UserSchema,
};
