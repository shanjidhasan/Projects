const express = require("express");
const {
	signUpUser,
	verifyUser,
	resendOTP,
	loginUser,
	changePassword,
	resetPassword,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/verification", verifyUser);
router.post("/resend_otp", resendOTP);
router.post("/login", loginUser);
router.post("/change_password", changePassword);
router.post("/reset_password", resetPassword);

module.exports = router;
