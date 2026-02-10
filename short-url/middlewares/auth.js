const { getUser } = require("../services/auth");

function checkForAuthentication(req, res, next) {
  // console.log("req.headers: ", req.headers);

  // const authorizationHeaderValue = req.headers["authorization"];

  // req.user = null;

  // if (
  //   !authorizationHeaderValue ||
  //   !authorizationHeaderValue.startsWith("Bearer")
  // )
  //   return next();

  // const token = authorizationHeaderValue.split("Bearer ")[1];

  // const user = getUser(token);

  // req.user = user;

  // return next();

  const token = req.cookies["short-url-jwt"];

  if (!token) return next();

  const user = getUser(token);

  if (!user) return res.status(401).redirect("/login");

  req.user = user;

  next();
}

function restrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).redirect("/login");

    if (!roles.includes(req.user.role))
      return res.status(403).render("forbidden");

    return next();
  };
}

async function restrictToLoggedInUserOnly(req, res, next) {
  const token = req.cookies["short-url-jwt"];

  if (!token) return res.status(401).redirect("/login");

  const user = getUser(token);

  if (!user) return res.status(401).redirect("/login");

  req.user = user;

  next();
}

async function checkAuth(req, res, next) {
  const token = req.cookies["short-url-jwt"];

  const user = getUser(token);

  req.user = user;

  next();
}

module.exports = {
  restrictToLoggedInUserOnly,
  checkAuth,
  checkForAuthentication,
  restrictTo,
};
