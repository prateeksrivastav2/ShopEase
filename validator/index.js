// validator/index.js
const { body, validationResult } = require('express-validator');

exports.userSignupValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Email must be valid')
    .isLength({ min: 4, max: 32 })
    .withMessage('Email must be between 3 to 32 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array().map(error => error.msg)[0];
      return res.status(400).json({ error: firstError });
    }
    next();
  },
];
