var express = require('express');
var router = express.Router();
const {notRequireAuth, requireAuth, checkUser} = require('../middlewares/authMiddleware');
const userControll= require('../controllers/userControl');


router.use(checkUser)
/* GET home page. */
router.get('/',notRequireAuth, function(req, res, next) {
  res.render('index', { title: 'CatyChat' });
});
router.post('/search',requireAuth,userControll.search);
router.post('/save-chat',requireAuth, userControll.saveChat);
router.get('/home',requireAuth,userControll.getMyFriendsList);
router.get('/open-chat/:id',requireAuth,userControll.openChat);
router.post('/delete-chat',requireAuth, userControll.deleteChat);
router.post('/acceptFriend',requireAuth,userControll.acceptFriend);
router.post('/addFriend',requireAuth,userControll.sendFriendRequest );
router.get('/getFriendRequest',requireAuth,userControll.getFriendRequestList);
router.get('/profile',requireAuth,userControll.myProfile);

module.exports = router;
