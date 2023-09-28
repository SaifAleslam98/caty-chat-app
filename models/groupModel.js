const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    creater_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    name:{
        type:String,
        required:[true, 'please enter group name']
    },
    image:{
        type:String,
        required:[true, 'please select group image']
    },
    limit:{
        type:Number,
        default: 100
    },
},{timestamps:true});
module.exports = mongoose.model('Group', groupSchema);