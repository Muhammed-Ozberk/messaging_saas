var express = require('express');
var router = express.Router();

/* Controllers */
var homeController = require('../controllers/home/homeController');
/* Controllers END */

router.get('/chat/:userID/:receiverID', homeController.chat);
router.get('/:userID', homeController.home);

module.exports = router;
