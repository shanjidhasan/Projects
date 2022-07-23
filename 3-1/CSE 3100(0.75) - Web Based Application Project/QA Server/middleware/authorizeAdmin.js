const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Role = require("../models/role.model");

module.exports = async (req, res, next) => {
	const token = req.header("x-auth-token");
	try {
		const verified = await jwt.verify(token, process.env.JWT_SECRET);
		if (verified) {
			res.locals.id = verified.userId;
			const user = await User.findOne({
				where: {
					id: verified.userId,
					is_active: true,
					is_deleted: false,
				},
				attributes: ["id"],
				include: [
					{
						model: Role,
						attributes: ["id", "is_admin"],
						as: "role",
					},
				],
			});
			if (user == null) {
				return res.status(401).json({
					status: 401,
					message: "No user found.",
				});
			}
			if(user.role.is_teacher == true){
				next();
			} else {
				return res.status(401).json({
					status: 401,
					message: "Access denied.",
				});
			}
		} else {
			// Access Denied
			return res.status(401).send(error);
		}
	} catch (error) {
		// Access Denied
		return res.status(401).send(error);
	}
};
