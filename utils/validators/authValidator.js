const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator')

exports.signupValidator = [
    check('email')
        .notEmpty().withMessage('please enter an email')
        .isEmail().withMessage('please enter a valid email')
    ,
    check('password')
        .notEmpty().withMessage('please enter a password')
        .isLength({ min: 6 }).withMessage('minimum password length is 6 characters')
        .isLength({ max: 20 }).withMessage('maximum password length is 20 characters'),
        validatorMiddleware
]