const express = require("express");
const {
	getAllReports,
	getSingleReport,
	getNReport,
	createReport,
	updateReport,
	deleteReport,
	upvoteReport,
	downvoteReport,
} = require("../controllers/development.controller");
const authorizeVerifiedUser = require("../middleware/authorizeVerifiedUser");
const router = express.Router();

router.get("/get_all_reports", authorizeVerifiedUser, getAllReports);
router.get(
	"/get_single_report/:reportId",
	authorizeVerifiedUser,
	getSingleReport
);
router.get("/get_n_report/:n", authorizeVerifiedUser, getNReport);
router.post("/create_report", authorizeVerifiedUser, createReport);
router.patch("/update_report/:reportId", authorizeVerifiedUser, updateReport);
router.delete("/delete_report/:reportId", authorizeVerifiedUser, deleteReport);
router.patch("/upvote_report/:reportId", authorizeVerifiedUser, upvoteReport);
router.patch(
	"/downvote_report/:reportId",
	authorizeVerifiedUser,
	downvoteReport
);

module.exports = router;
