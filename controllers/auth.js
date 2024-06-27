const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for auth check
const { errorHandler } = require('../helpers/dbErrorHandler');
const { toLower } = require('lodash');

require('dotenv').config();

exports.signup = (req, res) => {
  console.log('req.body', req.body);
  const { name, email, password, role } = req.body;
  let rol = 0;
  console.log(role);
  if (toLower(role) === "seller") rol = 1;

  const user = new User({
    name: name,
    email: email,
    password: password,
    role: rol
  });

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err) || 'Error saving user', // Ensure errorHandler is used correctly
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email doesn't exist. Please signup.",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password didn't match",
      });
    }
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET
    );
    res.cookie('t', token, { expire: new Date() + 9999 });
    const { _id, name, email, role,role2 } = user;
    // console.log("role2");
    // console.log(role2);
    // console.log("role2");
    return res.json({ token, user: { _id, email, name, role, role2 } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'], // Add algorithms if necessary
  userProperty: 'auth',
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'Access denied',
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access denied',
    });
  }
  next();
};

exports.isRealAdmin = (req, res, next) => {
  if (req.profile.role !== 1 || req.profile.role2 !== 1) {
    return res.status(403).json({
      error: 'Admin resource! Access denied',
    });
  }
  next();
};
