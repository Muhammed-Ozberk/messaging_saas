var express = require('express');
var router = express.Router();

/* Controllers */
var apiController = require('../controllers/api/apiController');
var authenticate = require('../middlewares/authenticate');
/* Controllers END */

router.post('/auth/login', apiController.login);

/** GET Fetch Messages  */
router.get('/fetch-messages/:conversationID', authenticate, apiController.fetchMessages);
/**  GET Fetch Messages END  */

/** GET Join Chat  */
router.get('/join-chat/:senderID/:receiverID', authenticate, apiController.joinChat);
/**  GET Join Chat END  */

/** POST Save Message  */
router.post('/save-message', authenticate, apiController.sendMessage);
/** POST Save Message END  */

module.exports = router;
