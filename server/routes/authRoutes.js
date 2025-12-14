const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { requestOtp, verifyOtp, logout, me } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/send-otp', [ body('email').isEmail().withMessage('Enter valid email') ], requestOtp);
router.post('/verify-otp', [ body('email').isEmail(), body('otp').isLength({ min: 6, max: 6 }) ], verifyOtp);

router.post("/logout", logout);

router.get("/me", authMiddleware, me);
module.exports = router;