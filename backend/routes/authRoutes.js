const express = require('express');
const { register, login, logout, getMe, verifyToken } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.get('/verify', verifyToken); 

module.exports = router;