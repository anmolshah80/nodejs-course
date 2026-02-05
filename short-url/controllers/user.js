const { v4: uuidv4 } = require('uuid');

const User = require('../models/user');
const { setUser } = require('../services/auth');

async function handleUserSignup(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: 'failed',
      error: 'name, email, and password are required',
    });
  }

  await User.create({
    name,
    email,
    password,
  });

  return res.status(201).redirect('/');
}

async function handleUserLogin(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.render('login', {
      error: 'Invalid email or password',
    });
  }

  const sessionId = uuidv4();

  setUser(sessionId, user);

  res.cookie('short-url-uid', sessionId);

  return res.redirect('/');
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
