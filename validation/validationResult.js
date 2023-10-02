const { validationResult } = require("express-validator");

module.exports.validationResult = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array(),
        data: null,
      });
    }
    next();
  };