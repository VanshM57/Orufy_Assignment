const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/mailer');
const jwt = require('jsonwebtoken');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.requestOtp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    let user = await User.findOne({ email });
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if(!user) {
      user = new User({ email, otp, otpExpires, isVerified: false });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.isVerified = false;
    }
    await user.save();
    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent to email' });
  } catch(err) { next(err); }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: 'No OTP requested for this email' });
    if(user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if(user.otpExpires < new Date()) return res.status(400).json({ message: 'OTP expired' });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // For cross-site requests (deployed client on a different origin),
      // `sameSite` must be 'none' and `secure` true so browsers send the cookie
      // when the client uses `withCredentials`/`credentials: 'include'`.
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 HOURS
    });
    res.json({ token, message: 'Verified' });
  } catch(err) { next(err); }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production"
  });

  res.json({ message: "Logged out successfully" });
};

exports.me = (req, res) => {
  res.json({ user: req.user });
};
