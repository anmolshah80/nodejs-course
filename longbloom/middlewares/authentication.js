const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);

      req.user = userPayload;
    } catch (error) {
      console.log("There was an error authenticating the token: ", error);
    }

    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
