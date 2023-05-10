var express = require('express');
var router = express.Router();

/* Controllers */
var homeController = require('../controllers/home/homeController');
/* Controllers END */

router.get('/', homeController.login);
router.post('/auth/login', homeController.loginPost);

module.exports = router;
