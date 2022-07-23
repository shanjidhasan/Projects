const express = require("express");
const {
	getAllUsers,
	createUserByAdmin,
	createAdmin,
	assignRoleToUser,
	revokeRoleFromUser,
	getUserDetailsByUsername,
} = require("../controllers/user.controller");
const authorizeAdmin = require("../middleware/authorizeVerifiedUser");

const router = express.Router();

router.get("/get_all_users", authorizeAdmin, getAllUsers);
router.post("/create_user_by_admin", authorizeAdmin, createUserByAdmin);
router.post("/create_admin", createAdmin);
router.post("/assign_role_to_user", authorizeAdmin, assignRoleToUser);
router.post("/revoke_role_from_user", authorizeAdmin, revokeRoleFromUser);

router.post("/get_user_details_by_username", getUserDetailsByUsername);

module.exports = router;
