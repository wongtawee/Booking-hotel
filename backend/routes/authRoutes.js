const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/auth'); 
router.post('/login', authController.login);

router.post('/register', authController.register);

router.get('/me', protect, authController.getMe);

router.put('/me', protect, authController.updateUser); 

module.exports = router;
