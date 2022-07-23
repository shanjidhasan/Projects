const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const User = require("../models/user.model");
const Role = require("../models/role.model");

require("dotenv").config();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_AUTH_USER,
		pass: process.env.EMAIL_AUTH_PASSWORD,
	},
});

exports.signUpUser = async function (user_data) {
	try {
		const {
			firstName,
			lastName,
			username,
			email,
			password,
			confirmPassword,
			asStudent,
			asTeacher,
			asGuardian,
		} = user_data;

		if (firstName === null || firstName === "") {
			throw new Error("First name is required");
		} else if (lastName === null || lastName === "") {
			throw new Error("Last name is required");
		} else if (username === null || username === "") {
			throw new Error("Username is required");
		} else if (email === null || email === "") {
			throw new Error("Email is required");
		} else if (password === null || password === "") {
			throw new Error("Password is required");
		} else if (confirmPassword === null || confirmPassword === "") {
			throw new Error("Confirm password is required");
		} else if (password !== confirmPassword) {
			throw new Error("Passwords do not match");
		}

		var user = await User.findOne({
			where: {
				email,
			},
		});
		if (user) {
			throw new Error("Email Address is already registered");
		}

		const otpCode = Math.floor(1000 + Math.random() * 9000);
		var referCode = makeRandomString(6);
		// console.log(referCode);
		// 32 character string of random alphanumeric characters
		var randomString = makeRandomString(32);
		const imgUrl =
			"https://gravatar.com/avatar/" +
			randomString +
			"?s=400&d=robohash&r=x";
		user = await User.create({
			uuid: uuidv4(),
			first_name: firstName,
			last_name: lastName,
			username,
			email,
			password: await bcrypt.hash(password, 10),
			profile_picture: imgUrl,
			is_verified: true,
			is_active: true,
			otp_code: otpCode,
			otp_expiry: new Date(new Date().getTime() + 10 * 60 * 1000),
			reffer_code: referCode,
		});

		var role = await Role.create({
			uuid: uuidv4(),
		});
		role.is_teacher = true;
		await role.save();
		user.role_id = role.id;
		await user.save();

		// Send email to user with OTP
		var to = email;
		var subject = "OTP for Sign Up";
		var text = "Your OTP is " + otpCode;
		sendEmail(to, subject, text);

		user = await User.findOne({
			where: {
				email,
			},
			attributes: [
				"id",
				"email",
				"username",
				"phone",
				"first_name",
				"last_name",
				"profile_picture",
				"reffer_code",
				"role_id",
				"is_active",
				"is_verified",
			],
			include: [
				{
					model: Role,
					as: "role",
					attributes: [
						"is_student",
						"is_teacher",
						"is_admin",
						"is_superadmin",
					],
				},
			],
		});
		return user;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

exports.verifyUser = async function (data) {
	const { email, otpCode, resetPassword } = data;
	// console.log(data);
	var user = await User.findOne({
		where: {
			email: email,
		},
	});
	if (!user) {
		throw new Error("User does not exist");
	}
	if (user.otp_code != otpCode) {
		// console.log("OTP does not match");
		throw new Error("OTP does not match");
	}
	if (!resetPassword && user.otp_expiry < new Date()) {
		throw new Error("OTP expired");
	}
	user.otp_code = null;
	user.otp_expiry = null;
	user.is_active = true;
	user.is_verified = true;
	await user.save();

	if (!resetPassword) {
		// Send success email
		var to = email;
		var subject = "Account Verified";
		var text = "Your account has been verified";
		sendEmail(to, subject, text);
	}
	return user;
};

exports.resendOTP = async function (data) {
	const { email } = data;
	var user = await User.findOne({
		where: {
			email: email,
		},
	});
	if (!user) {
		throw new Error("Email Address is not registered");
	}
	const otpCode = Math.floor(1000 + Math.random() * 9000);
	const otpExpiry = new Date(new Date().getTime() + 10 * 60 * 1000);
	user.otp_code = otpCode;
	user.otp_expiry = otpExpiry;
	await user.save();

	// Send email to user with OTP
	var to = email;
	var subject = "OTP for Sign Up";
	var text = "Your OTP from ischool to verify your account: " + otpCode;
	sendEmail(to, subject, text);

	return user;
};

exports.loginUser = async function (user_data) {
	try {
		const { email, password } = user_data;
		console.log("heree=====1", email);
		var user = await User.findOne({
			where: {
				email: email,
			},
			attributes: ["id", "password", "is_active", "is_verified"],
		});
		if (!user) {
			throw new Error("Email Address is not registered");
			console.log("heree=====2", user);
		}
		const isMatch = await bcrypt.compare(password, user.password);

		// console.log(user_data.password);
		// console.log(user.password);
		console.log("heree=====3", user);

		if (!isMatch) {
			throw new Error("Email or Password does not match");
			
			console.log("heree=====5");
		}
		console.log("heree=====4");
		if (!user.is_verified) {
			var otpCode = Math.floor(1000 + Math.random() * 9000);
			user.otp_code = otpCode;
			user.otp_expiry = new Date(new Date().getTime() + 10 * 60 * 1000);
			await user.save();
			// Send email to user with OTP
			var to = user.email;
			var subject = "OTP for Sign Up";
			var text =
				"Your OTP from ischool to verify your account: " + otpCode;
			sendEmail(to, subject, text);
			throw new Error(
				"User is not verified. Verification code has been sent again. Please verify your account."
			);
		}

		const token = await JWT.sign(
			{
				userId: user.id,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "4h",
			}
		);

		user.token = token;
		await user.save();

		user = await User.findOne({
			where: {
				email,
			},
			attributes: [
				"id",
				"email",
				"username",
				"token",
				"phone",
				"first_name",
				"last_name",
				"profile_picture",
				"role_id",
				"is_active",
				"is_verified",
			],
			include: [
				{
					model: Role,
					as: "role",
					attributes: [
						"is_student",
						"is_teacher",
						"is_admin",
						"is_superadmin",
					],
				},
			],
		});

		// get class count
		// var courses = await Course.findAll({
		// 	where: {
		// 		created_by: user.id,
		// 	},
		// 	attributes: ["id"],
		// });
		// user.dataValues.class_count = courses.length;

		return user;
	} catch (err) {
		throw new Error(err);
	}
};


exports.changePassword = async function (user_data) {
	const { email, oldPassword, newPassword, confirmPassword } = user_data;
	if (email == null || email == "") {
		throw new Error("Email is required");
	} else if (oldPassword == null || oldPassword == "") {
		throw new Error("Old Password is required");
	} else if (newPassword == null || newPassword == "") {
		throw new Error("New Password is required");
	} else if (confirmPassword == null || confirmPassword == "") {
		throw new Error("Confirm Password is required");
	} else if (newPassword.length < 6) {
		throw new Error("Password must be atleast 6 characters long");
	} else if (newPassword != confirmPassword) {
		throw new Error("New Password and Confirm Password does not match");
	}
	var user = await User.findOne({
		where: {
			email: email,
			is_active: true,
			is_deleted: false,
		},
	});
	if (!user) {
		throw new Error("User not found");
	}
	const isMatch = await bcrypt.compare(oldPassword, user.password);
	if (!isMatch) {
		throw new Error("Old Password is incorrect");
	}
	var newPassHashed = await bcrypt.hash(newPassword, 10);
	user.password = newPassHashed;
	await user.save();
	return "Password changed successfully";
};


exports.resetPassword = async function (data) {
	const { email, otpCode, newPassword, confirmPassword } = data;
	var user = await User.findOne({
		where: {
			email: email,
		},
	});
	if (!user) {
		throw new Error("Email Address not found");
	}
	if (!user.is_active) {
		throw new Error("User is not active");
	}
	if (!user.is_verified) {
		throw new Error("User is not verified");
	}
	if (user.otp_code != otpCode) {
		throw new Error("Invalid OTP Code");
	}
	if (newPassword.length < 6) {
		throw new Error("Password must be atleast 6 characters long");
	}
	if (newPassword != confirmPassword) {
		throw new Error("Password does not match");
	}
	user.password = await bcrypt.hash(newPassword, 10);
	await user.save();
	return "Password reset successfully";
};

const makeRandomString = function (length) {
	var result = "";
	var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
};

const sendEmail = (to, subject, text) => {
	const mailOptions = {
		from: process.env.EMAIL_AUTH_USER,
		to: to,
		subject: subject,
		text: text,
	};
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			// console.log(error);
		} else {
			// console.log("Email sent: " + info.response);
		}
	});
};
