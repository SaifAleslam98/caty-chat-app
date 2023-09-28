const User = require('../models/userModel');
const createToken = require('../utils/createToken');
const multer = require('multer');
const path = require('path');

//multer options
const storage = multer.diskStorage({
    destination: 'public/images/',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix + '-' + file.originalname)

    }
})
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        var validextensions = ['.png', '.jpg', '.jpeg'];
        var ext = path.extname(file.originalname);
        if (!validextensions.includes(ext)) {
            return cb(new Error('please choose png or jpg or jpeg file'))
        }
        cb(null, true)
    },
    limits: { fileSize: 1024 * 1024 * 4 }
})


const maxAge = 3 * 24 * 60 * 60;
const handleErrors = (err) => {
    let errors = { email: '', password: '', username: '', gender: '' }
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    if (err.code == 11000) {
        errors.email = 'this email already exist';
        return errors;
    }
    if (err.message == 'no file') { errors.file = 'please select a file' }
    if (err.message == 'user not found') { errors.email = err.message }
    if (err.message == 'wrong password') { errors.password = err.message }
    return errors;
}

module.exports.login_get = (req, res) => {
    res.render('auth/login', { title: 'login' })
}
module.exports.signup_get = (req, res) => {
    res.render('auth/signup', { title: 'signup' })
}
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.cookie('user', JSON.stringify(user));
        res.status(200).json({ user: user._id })
    } catch (err) {
        console.log(err)
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

module.exports.signup_post = async (req, res) => {
    try {
        const { username, email, password, gender } = req.body;
        let image = '';
        if (gender === 'male') {
            image = 'profile/male-icon-7928.png'
        }
        else {
            image = 'profile/female-icon-7877.png'
        }
        const user = await User.create({ username, email, password, gender, image });
        res.status(201).send({ success: 'your account created successfully!' })

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).send({ errors })
    }
}

module.exports.logout_get = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.cookie('user', '', { maxAge: 1 });
    res.redirect('/');
}