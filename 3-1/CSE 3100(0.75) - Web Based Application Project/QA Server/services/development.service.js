const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const Development = require("../models/development.model");
const User = require("../models/user.model");

exports.getAllReports = async () => {
	try {
		const reports = await Development.findAll({
			order: [["upvote_count", "DESC"]],
			include: [
				{
					model: User,
					as: "user",
					attributes: ["id", "first_name", "last_name"],
				},
			],
		});
		return reports;
	} catch (error) {
		throw new Error(error);
	}
};

exports.getSingleReport = async (params) => {
	try {
		const { reportId } = params;
		const reportData = await Development.findOne({
			where: {
				id: reportId,
			},
			include: [
				{
					model: User,
					as: "user",
					attributes: ["id", "first_name", "last_name"],
				},
			],
		});
		return reportData;
	} catch (error) {
		throw new Error(error);
	}
};

exports.getNReport = async (params) => {
	try {
		const { n } = params;
		const reportData = await Development.findAll({
			// range of n to n+5 records
			limit: 5, // limit means how many records to be returned
			offset: (n - 1) * 5 < 0 ? 0 : (n - 1) * 5, // offset means how many records to skip
			order: [["upvote_count", "DESC"]],
			include: [
				{
					model: User,
					as: "user",
					attributes: ["id", "first_name", "last_name"],
				},
			],
		});
		// console.log(await Development.count());
		return {
			reportData: reportData,
			totalPage: Math.ceil((await Development.count()) / 5),
		};
	} catch (error) {
		throw new Error(error);
	}
};

exports.createReport = async (data, userId) => {
	try {
		const { topic, details } = data;

		if (!topic || !details) {
			throw new Error("Missing required fields");
		}
		if (topic.length > 100) {
			throw new Error("Topic cannot be more than 100 characters");
		}
		if (details.length > 1000) {
			throw new Error("Details cannot be more than 1000 characters");
		}

		const reportData = await Development.create({
			uuid: uuidv4(),
			topic,
			details,
			posted_by: userId,
		});

		return reportData;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

exports.updateReport = async (params, data) => {
	console.log(data);
	try {
		const { reportId } = params;
		const {
			topic,
			details,
			is_acknowledged,
			is_in_progress,
			is_completed,
		} = data;

		const reportData = await Development.findOne({
			where: {
				id: reportId,
			},
			include: [
				{
					model: User,
					as: "user",
					attributes: ["id", "first_name", "last_name"],
				},
			],
		});
		if (!reportData) {
			throw new Error("Report not found");
		}

		if (topic && topic.length > 100) {
			throw new Error("Topic cannot be more than 100 characters");
		}
		if (details && details.length > 1000) {
			throw new Error("Details cannot be more than 1000 characters");
		}
		if (is_acknowledged !== undefined) {
			reportData.is_acknowledged = is_acknowledged;
		}
		if (is_in_progress !== undefined) {
			reportData.is_in_progress = is_in_progress;
		}
		if (is_completed !== undefined) {
			reportData.is_completed = is_completed;
		}
		if (topic) {
			reportData.topic = topic;
		}
		if (details) {
			reportData.details = details;
		}
		await reportData.save();

		return reportData;
	} catch (error) {
		throw new Error(error);
	}
};

exports.deleteReport = async (params) => {
	try {
		const { reportId } = params;
		const reportData = await Development.findOne({
			where: {
				id: reportId,
			},
			include: [
				{
					model: User,
					as: "user",
					attributes: ["id", "first_name", "last_name"],
				},
			],
		});
		if (!reportData) {
			throw new Error("Report not found");
		}
		await reportData.destroy();
		return "Report deleted successfully";
	} catch (error) {
		throw new Error(error);
	}
};

exports.upvoteReport = async (params) => {
	try {
		const { reportId } = params;
		const reportData = await Development.findOne({
			where: {
				id: reportId,
			},
			include: [
				{
					model: User,
					as: "user",
					attributes: ["id", "first_name", "last_name"],
				},
			],
		});
		if (!reportData) {
			throw new Error("Report not found");
		}
		reportData.upvote_count += 1;
		await reportData.save();
		return reportData;
	} catch (error) {
		throw new Error(error);
	}
};

exports.downvoteReport = async (params) => {
	try {
		const { reportId } = params;
		const reportData = await Development.findOne({
			where: {
				id: reportId,
			},
			include: [
				{
					model: User,
					as: "user",
					attributes: ["id", "first_name", "last_name"],
				},
			],
		});
		if (!reportData) {
			throw new Error("Report not found");
		}
		reportData.downvote_count += 1;
		await reportData.save();
		return reportData;
	} catch (error) {
		throw new Error(error);
	}
};
