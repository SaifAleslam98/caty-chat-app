const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const Group = require('../models/groupModel');
const FriendRequest = require('../models/friendRequest');

// chat Controller
module.exports.saveChat = async (req, res) => {
    try {
        var chat = new Chat({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            message: req.body.message
        });
        const newChat = await chat.save();
        res.status(200).send({ success: true, msg: 'message sent!', data: newChat });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}
module.exports.openChat = async (req, res) => {
    try {
        var receiverUser = await User.findById(req.params.id).select('-password -email').lean();
        res.render('users/chat', {
            title: receiverUser.username,
            receiver_user: receiverUser
        });
    } catch (error) {
        if (error.reason = 'BSONError') {
            res.redirect('/home')
        }
        else { console.log(error) }
    }
}
module.exports.deleteChat = async (req, res) => {
    try {
        await Chat.deleteOne({ _id: req.body.id });
        res.status(200).send({ success: true });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}
// users controller
module.exports.loadGroups = async (req, res) => {
    try {
        const groups = await Group.find({ creater_id: res.locals.user._id })
        res.render('users/groups', { title: 'Groups', groups: groups })
    } catch (error) {

    }
}
module.exports.createGroup = async (req, res) => {
    try {
        const group = new Group({
            creater_id: res.locals.user._id,
            name: req.body.name,
            image: req.file.filename
        })
        await group.save();
        const groups = await Group.find({ creater_id: res.locals.user._id })
        res.render('users/groups', { success: true, msg: req.body.name + 'Group Created Successfully', groups: groups })
    } catch (error) {
        res.status(400).send({ success: false, msg: error })
    }
}
module.exports.getAllUsers = async (req, res) => {
    try {
        const usersList = await User.find({ _id: { $nin: res.locals.user._id } }).select('-password').lean();
        res.render('users/home', { title: 'Home', allusers: usersList });
    } catch (error) {
        res.status(400).send({ msg: error.message })
    }


}
module.exports.sendFriendRequest = async (req, res) => {
    try {
        const checkFriendRequest = await FriendRequest.find({
            $or: [
                { sender_id: res.locals.user._id, receiver_id: req.body.id },
            ]
        });
        if(checkFriendRequest.length < 1){
            await FriendRequest.create({
                sender_id: res.locals.user._id, receiver_id: req.body.id
            })
            res.status(200).send({ success: true, msg: 'sent' })
        }
        else{
            res.status(200).send({ success: true, msg: 'you sent request before' })
        }
        
    } catch (error) {
        res.status(400).send({ success: false, msg: error })
    }
}
module.exports.search = async (req, res) => {
    try {
        const result = await User.find(
            { username: { $regex: req.body.keyword } }
        ).select('_id username image').lean()
        res.render('users/searchResult',{title:'search', data: result})
        //res.status(200).send({ result })
    } catch (error) {
        res.status(400).send({ error })
    }
}
module.exports.getFriendRequestList = async(req,res)=>{
    try {
        const friendRequestList = await FriendRequest.find({receiver_id: res.locals.user._id}).populate('sender_id');
        res.status(200).send({success:true, data: friendRequestList})
    } catch (error) {
        console.log(error)
        res.status(400).send({success:false, msg: error})
    }
}