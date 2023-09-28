const mongoose = require('mongoose');

const friendSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'try to relogin']
    },
    freinds: Array,
},{timestamps:true});
module.exports = mongoose.model('Friends', friendSchema);