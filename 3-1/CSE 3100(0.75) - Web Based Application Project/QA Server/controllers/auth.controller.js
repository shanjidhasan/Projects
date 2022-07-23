const { response } = require("express");
const AuthService = require("../services/auth.service");

module.exports = {
	signUpUser: (req, res) => {
		AuthService.signUpUser(req.body)
			.then((user) => {
				return res.status(200).json({
					status: 200,
					data: {
						email: user.email,
					},
					message: "User created successfully",
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					message: "Error creating user",
					error: err.message,
				});
			});
	},
	verifyUser: (req, res) => {
		AuthService.verifyUser(req.body)
			.then((user) => {
				return res.status(200).json({
					status: 200,
					message: "User verified successfully",
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					message: "Error verifying user",
					error: err.message,
				});
			});
	},
	resendOTP: (req, res) => {
		AuthService.resendOTP(req.body)
			.then((user) => {
				return res.status(200).json({
					status: 200,
					message: "OTP sent successfully",
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					message: "Error sending OTP",
					error: err.message,
				});
			});
	},
	loginUser: (req, res) => {
		AuthService.loginUser(req.body)
			.then((response) => {
				return res.status(200).json({
					status: 200,
					data: {
						user: response,
						isSocialAuth: false,
					},
					message: "User logged in successfully",
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error logging in user",
					error: err.message,
				});
			});
	},
	socialSignUp: (req, res) => {
		AuthService.socialSignUp(req.body)
			.then((user) => {
				return res.status(200).json({
					status: 200,
					data: {
						uuid: user.uuid,
						userId: user.id,
						email: user.email,
						phone: user.phone,
						token: user.token,
						firstName: user.first_name,
						lastName: user.last_name,
						score: user.score,
						life: user.life,
						profilePic: user.profile_picture,
						zcoins: user.zcoins,
						refferCode: user.reffer_code,
						lifeString: user.life_string,
						isActive: user.is_active,
						isVerified: user.is_verified,
						isSocialAuth: true,
						monthlyScore: 0,
					},
					message: "User logged in successfully",
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error logging in user",
					error: err.message,
				});
			});
	},
	changePassword: (req, res) => {
		AuthService.changePassword(req.body)
			.then((response) => {
				return res.status(200).json({
					status: 200,
					data: response,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error changing password",
					error: err.message,
				});
			});
	},
	getResetPasswordCode: (req, res) => {
		AuthService.getResetPasswordCode(req.body)
			.then((user) => {
				return res.status(200).json({
					status: 200,
					data: {
						email: user.email,
						resetPassworCode: user.otp_code,
					},
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error getting password reset code",
					error: err.message,
				});
			});
	},
	resetPassword: (req, res) => {
		AuthService.resetPassword(req.body)
			.then((response) => {
				return res.status(200).json({
					status: 200,
					message: response,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error resetting password",
					error: err.message,
				});
			});
	},
};
