const jwt = require("jsonwebtoken");

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    profileImageURL: user.profileImageURL,
    fullName: user.fullName,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
