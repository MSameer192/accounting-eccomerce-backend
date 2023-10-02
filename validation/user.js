const { body, check } = require("express-validator");

module.exports.signinValidation = [
  body("email").isEmail().trim().escape().withMessage("email is required"),
  body("password").not().isEmpty().withMessage("password is required"),
];

module.exports.signupValidation = [
  body("firstName").not().isEmpty().withMessage("firstName is required"),
  body("lastName").not().isEmpty().withMessage("lastName is required"),
  body("email").isEmail().trim().escape().withMessage("email is required"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("password should be 5 character long"),
];
