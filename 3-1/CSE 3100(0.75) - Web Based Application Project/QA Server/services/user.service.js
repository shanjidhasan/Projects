const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Course = require("../models/course.model");
const { isUserValid, isUserActive, isUserVerified } = require("./utils");

exports.getAllUsers = async function () {
	var users = await User.findAll({
		attributes: [
			"id",
			"first_name",
			"last_name",
			"username",
			"email",
			"phone",
			"about_me",
			"is_verified",
			"is_active",
			"otp_code",
			"reffer_code",
			"profile_picture",
			"role_id",
		],
		order: [["id", "ASC"]],
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
	return users;
};

exports.createAdmin = async function (data) {
	const { email, password, first_name, last_name } = data;
	if (!email) {
		throw new Error("Email is required");
	}
	if (!password) {
		throw new Error("Password is required");
	}
	if (!first_name) {
		throw new Error("First name is required");
	}
	if (!last_name) {
		throw new Error("Last name is required");
	}
	const user = await User.findOne({ where: { email } });
	if (user) {
		throw new Error("User already exists");
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	var randomString = makeRandomString(32);
	const imgUrl =
		"https://gravatar.com/avatar/" + randomString + "?s=400&d=robohash&r=x";
	var newUser = await User.create({
		uuid: uuidv4(),
		email,
		password: hashedPassword,
		first_name,
		last_name,
		profile_picture: imgUrl,
		is_verified: true,
		is_active: true,
	});
	const newRole = await Role.create({
		uuid: uuidv4(),
		user_id: newUser.id,
		is_admin: true,
		is_superadmin: false,
	});
	newUser.role_id = newRole.id;
	await newUser.save();

	const userData = await User.findOne({
		where: { id: newUser.id },
		attributes: [
			"id",
			"first_name",
			"last_name",
			"email",
			"profile_picture",
			"role_id",
		],
		include: [
			{
				model: Role,
				as: "role",
				attributes: [
					"is_admin",
					"is_superadmin",
				],
			},
		],
	});
	return userData;
};

exports.assignRoleToUser = async function (data) {
	const { userId, roleName } = data;

	if (!userId || !roleName) {
		throw new Error("User Id and Role Name is required");
	}
	var user = await User.findOne({
		where: {
			id: userId,
		},
		include: [
			{
				model: Role,
				as: "role",
				attributes: [
					"is_student",
					"is_teacher",
					"is_guardian",
					"is_school_admin",
					"is_admin",
					"is_superadmin",
				],
			},
		],
	});

	isUserValid(user);

	if (
		roleName !== "is_student" &&
		roleName !== "is_teacher" &&
		roleName !== "is_guardian" &&
		roleName !== "is_school_admin" &&
		roleName !== "is_admin" &&
		roleName !== "is_superadmin"
	) {
		throw new Error("Role name is invalid");
	}
	var role = await Role.findOne({
		where: {
			id: user.role_id,
		},
	});
	if (!role) {
		throw new Error("Role does not exist");
	} else {
		if (roleName === "is_student") {
			role.is_student = true;
			await role.save();
		} else if (roleName === "is_teacher") {
			role.is_teacher = true;
			await role.save();
		} else if (roleName === "is_guardian") {
			role.is_guardian = true;
			await role.save();
		} else if (roleName === "is_school_admin") {
			role.is_school_admin = true;
			await role.save();
		} else if (roleName === "is_admin") {
			role.is_admin = true;
			await role.save();
		} else if (roleName === "is_superadmin") {
			role.is_superadmin = true;
			await role.save();
		}
	}
	user = await User.findOne({
		where: {
			id: userId,
		},
		attributes: [
			"id",
			"first_name",
			"last_name",
			"username",
			"email",
			"profile_picture",
			"role_id",
		],
		include: [
			{
				model: Role,
				as: "role",
				attributes: [
					"is_student",
					"is_teacher",
					"is_guardian",
					"is_school_admin",
					"is_admin",
					"is_superadmin",
				],
			},
		],
	});
	return user;
};

exports.revokeRoleFromUser = async function (data) {
	const { userId, roleName } = data;

	if (!userId || !roleName) {
		throw new Error("User Id or Role Name is required");
	}
	var user = await User.findOne({
		where: {
			id: userId,
		},
		include: [
			{
				model: Role,
				as: "role",
				attributes: [
					"is_admin",
					"is_superadmin",
				],
			},
		],
	});
	if (!user) {
		throw new Error("User does not exist");
	}
	if (
		roleName !== "is_admin" &&
		roleName !== "is_superadmin"
	) {
		throw new Error("Role name is invalid");
	}
	var role = await Role.findOne({
		where: {
			id: user.role_id,
		},
	});
	if (!role) {
		throw new Error("Role does not exist");
	} else {
		if (roleName === "is_admin") {
			role.is_admin = false;
			await role.save();
		} else if (roleName === "is_superadmin") {
			role.is_superadmin = false;
			await role.save();
		}
	}
	user = await User.findOne({
		where: {
			id: userId,
		},
		attributes: [
			"id",
			"first_name",
			"last_name",
			"email",
			"profile_picture",
			"role_id",
		],
		include: [
			{
				model: Role,
				as: "role",
				attributes: [
					"is_admin",
					"is_superadmin",
				],
			},
		],
	});
	return user;
};

exports.getUserDetailsByUsername = async function (data) {
	const { username, userId } = data;

	try {
		if (!username) {
			throw new Error("Username is required");
		}
		const user = await User.findOne({
			where: {
				username,
			},
			attributes: [
				"id",
				"first_name",
				"last_name",
				"username",
				"email",
				"phone",
				"blood_group",
				"date_of_birth",
				"address",
				"about_me",
				"profession",
				"is_verified",
				"is_active",
				"profile_picture",
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

		isUserValid(user);
		isUserActive(user);
		isUserVerified(user);
		if (user.id !== userId) {
			throw new Error("Unauthorized access");
		}

		// get class count
		const courses = await Course.findAll({
			where: {
				created_by: user.id,
			},
			attributes: ["id", "course_code", "subject_x_class_id"],
			// include: {
			// 	model: Subject_x_Class,
			// 	as: "subject",
			// 	attributes: ["id", "class_id", "subject_name"],
			// 	// include: {
			// 	// 	model: Class,
			// 	// 	as: "class",
			// 	// 	attributes: ["id", "class_name"],
			// 	// },
			// },
		});
		user.dataValues.class_count = courses.length;

		return {
			user,
			courses,
		};
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};
exports.getUserDetailsByUserId = async function (data) {
	const { userId } = data;

	try {
		if (!userId) {
			throw new Error("User Id is required");
		}
		const user = await User.findOne({
			where: {
				id: userId,
			},
			attributes: [
				"id",
				"first_name",
				"last_name",
				"username",
				"email",
				"phone",
				"blood_group",
				"date_of_birth",
				"address",
				"about_me",
				"profession",
				"is_verified",
				"is_active",
				"profile_picture",
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
				{
					model: SocialAuth,
					as: "social_auth",
					attributes: ["provider", "social_media_id"],
				},
			],
		});

		isUserValid(user);
		isUserActive(user);
		isUserVerified(user);

		// get class count
		const courses = await Course.findAll({
			where: {
				created_by: user.id,
			},
			attributes: ["id", "course_code", "subject_x_class_id"],
			include: {
				model: Subject_x_Class,
				as: "subject",
				attributes: ["id", "class_id", "subject_name"],
				include: {
					model: Class,
					as: "class",
					attributes: ["id", "class_name"],
				},
			},
		});
		user.dataValues.class_count = courses.length;

		return {
			user,
			courses,
		};
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

function makeRandomString(length) {
	var result = "";
	var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}
