//@desc middleware catch the error coming from req
const {  validationResult } = require('express-validator');

const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        
            
    }
    next();
};

module.exports = validatorMiddleware;