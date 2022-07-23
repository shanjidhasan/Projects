const UserService = require("../services/user.service");

module.exports = {
	getAllUsers: (req, res) => {
		UserService.getAllUsers()
			.then((response) => {
				return res.status(200).json({
					status: 200,
					data: response,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error fetching information",
					error: err.message,
				});
			});
	},
	createUserByAdmin: (req, res) => {
		UserService.createUserByAdmin(req.body)
			.then((response) => {
				return res.status(200).json({
					status: 200,
					data: response,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error creating user",
					error: err.message,
				});
			});
	},
	createAdmin: (req, res) => {
		UserService.createAdmin(req.body)
			.then((response) => {
				return res.status(200).json({
					status: 200,
					data: response,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error creating admin",
					error: err.message,
				});
			});
	},
	assignRoleToUser: (req, res) => {
		UserService.assignRoleToUser(req.body)
			.then((response) => {
				return res.status(200).json({
					status: 200,
					data: response,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error assigning role",
					error: err.message,
				});
			});
	},
	revokeRoleFromUser: (req, res) => {
		UserService.revokeRoleFromUser(req.body)
			.then((response) => {
				return res.status(200).json({
					status: 200,
					data: response,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error revoking role",
					error: err.message,
				});
			});
	},
	
	getUserDetailsByUsername: (req, res) => {
		UserService.getUserDetailsByUsername(req.body)
			.then((user) => {
				return res.status(200).json({
					status: 200,
					data: user,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error fetching user",
					error: err.message,
				});
			});
	},
	
};
