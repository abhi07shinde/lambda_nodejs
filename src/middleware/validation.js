const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/responses');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return ApiResponse.validationError(res, errorMessages);
  }
  
  next();
};

module.exports = handleValidationErrors;