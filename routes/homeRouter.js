var express = require('express');
var router = express.Router();

/* Controllers */
var homeController = require('../controllers/home/homeController');
var authenticate = require('../middlewares/authenticate');
/* Controllers END */

router.get('/chat/:userID/:receiverID', authenticate, homeController.chat);
router.get('/:userID', authenticate, homeController.home);

module.exports = router;
