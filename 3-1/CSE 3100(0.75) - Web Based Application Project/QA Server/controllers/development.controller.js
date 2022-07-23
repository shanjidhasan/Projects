const DevelopmentService = require("../services/development.service");

module.exports = {
	getAllReports: (req, res) => {
		DevelopmentService.getAllReports()
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
	getSingleReport: (req, res) => {
		DevelopmentService.getSingleReport(req.params)
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
	getNReport: (req, res) => {
		DevelopmentService.getNReport(req.params)
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
	createReport: (req, res) => {
		DevelopmentService.createReport(req.body, res.locals.id)
			.then((response) => {
				return res.status(200).json({
					status: 200,
					data: response,
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					message: "Error creating class",
					error: err.message,
				});
			});
	},
	updateReport: (req, res) => {
		DevelopmentService.updateReport(req.params, req.body, res.locals.id)
			.then((response) => {
				return res.status(200).json({
					status: 200,
					data: response,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error updating information",
					error: err.message,
				});
			});
	},
	deleteReport: (req, res) => {
		DevelopmentService.deleteReport(req.params)
			.then((response) => {
				return res.status(200).json({
					status: 200,
					data: response,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error deleting information",
					error: err.message,
				});
			});
	},
	upvoteReport: (req, res) => {
		DevelopmentService.upvoteReport(req.params)
			.then((response) => {
				return res.status(200).json({
					status: 200,
					data: response,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error updating information",
					error: err.message,
				});
			});
	},
	downvoteReport: (req, res) => {
		DevelopmentService.downvoteReport(req.params)
			.then((response) => {
				return res.status(200).json({
					status: 200,
					data: response,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Error updating information",
					error: err.message,
				});
			});
	},
};
