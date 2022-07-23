const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
	// console.log("header", req);
	const token = req.header("x-auth-token");
	try {
		const verified = await jwt.verify(token, process.env.JWT_SECRET);
		if (verified) {
			res.locals.id = verified.userId;

			next();
		} else {
			// Access Denied
			return res.status(401).send(error);
		}
	} catch (error) {
		// Access Denied
		return res.status(401).send(error);
	}
};
