const { createHmac, randomBytes } = require("node:crypto");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default_avatar.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
      required: true,
    },
  },
  { timestamps: true },
);

// now the password hashing is being done using bcrypt library
// since the following implementation interferes with zod validation
// for `password` and `confirmPassword` fields' values check
// userSchema.pre("save", function (next) {
//   const user = this;

//   // early return if the user is not trying to modify the password
//   if (!user.isModified("password")) return;

//   const salt = randomBytes(16).toString();

//   // Source -> https://nodejs.org/api/crypto.html#crypto
//   const hashedPassword = createHmac("sha256", salt)
//     .update(user.password)
//     .digest("hex");

//   this.salt = salt;
//   this.password = hashedPassword;

//   next();
// });

const User = model("user", userSchema);

module.exports = User;
