const SHORT_ID_MAX_LENGTH = 8;

const ZOD_ERRORS = [
  {
    origin: "string",
    code: "too_small",
    minimum: 1,
    inclusive: true,
    path: ["fullName"],
    message: "Please enter your full name",
  },
  {
    origin: "string",
    code: "invalid_format",
    format: "email",
    pattern:
      "/^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$/",
    path: ["email"],
    message: "Please enter a valid email address",
  },
  {
    origin: "string",
    code: "too_small",
    minimum: 8,
    inclusive: true,
    path: ["password"],
    message: "Password should at least be 8 characters long",
  },
  {
    code: "custom",
    path: ["password"],
    message: "Password should have at least one uppercase character",
  },
  {
    code: "custom",
    path: ["password"],
    message: "Password should have at least one lowercase character",
  },
  {
    code: "custom",
    path: ["password"],
    message: "Password should have at least one number",
  },
  {
    code: "custom",
    path: ["password"],
    message: "Password should have at least one special character (!@#$%^&*)",
  },
  {
    code: "custom",
    path: ["confirmPassword"],
    message: "Password and confirm password do not match",
  },
];

module.exports = {
  SHORT_ID_MAX_LENGTH,
  ZOD_ERRORS,
};
