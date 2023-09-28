const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const async = require('hbs/lib/async');
const { check } = require('express-validator');


const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,'please enter an username'],
        minlength: [6,'minimum username length is 6 characters']
    },
    email: {
        type: String,
        required: [true, 'please enter an email'],
        unique: true,
        lowercase: true,
        
    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minlength: [6,'minimum password length is 6 characters']
    },
    image:{
        type:String,
        
    },
    is_online:{
        type:Boolean,
        default:false
    },
    gender:{
        type:String,
        enum:['male', 'female'],
        required:[true, 'please select a gender']
    }
},{timestamps:true});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next()
});
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error('wrong password')
    }
    throw Error('user not found')
}
module.exports = mongoose.model('User', userSchema);