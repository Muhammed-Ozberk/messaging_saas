var express = require('express');
var router = express.Router();

/* Controllers */
var apiController = require('../controllers/api/apiController');
/* Controllers END */

/** GET Fetch Messages  */
router.get('/fetch-messages/:conversationID', apiController.fetchMessages);
/**  GET Fetch Messages END  */

/** GET Login Socket  */
router.get('/login-socket/:userID', apiController.loginSocket);
/**  GET Login Socket END  */

/** GET Join Chat  */
router.get('/join-chat/:senderID/:receiverID', apiController.joinChat);
/**  GET Join Chat END  */

/** POST Save Message  */
router.post('/save-message', apiController.sendMessage);
/** POST Save Message END  */

module.exports = router;
