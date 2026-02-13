// const { createHmac } = require("node:crypto");
// const { createTokenForUser } = require("../services/authentication");
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

// Source -> https://mongoosejs.com/docs/typescript/statics-and-methods.html#with-generics
// userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
//   const user = await this.findOne({ email });

//   if (!user) throw new Error("User not found!");

//   const salt = user.salt;
//   const hashedPassword = user.password;

//   const userProvidedHash = createHmac("sha256", salt)
//     .update(password)
//     .digest("hex");

//   if (hashedPassword !== userProvidedHash)
//     throw new Error("Incorrect password!");

//   const token = createTokenForUser(user);

//   return token;
// });

const User = model("user", userSchema);

module.exports = User;
