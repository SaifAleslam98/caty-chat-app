const mongoose = require('mongoose');

const freindRequestSchema = mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isAccepted:{
        type:Boolean,
        default:false
    }
},{timestamps:true});
module.exports = mongoose.model('FreindRequest', freindRequestSchema);