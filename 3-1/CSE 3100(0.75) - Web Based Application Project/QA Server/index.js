const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require("./database");

// routes
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");

const developmentRoutes = require("./routes/development.route");

// models

const Role = require("./models/role.model");
const User = require("./models/user.model");
const Development = require("./models/development.model");


database
	.authenticate()
	.then(() => {
		console.log("Database connection has been established successfully.");
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
	});

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
	})
);
app.set("view engine", "ejs");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/development", developmentRoutes);

const PORT = process.env.PORT || 8001;

const routes = [
	{
		path: "/api/auth/login",
		method: "POST",
		description: "User Login",
		access: "public",
		parameters: [
			{
				name: "email",
				description: "Email Address",
				type: "string",
				required: true,
			},
			{
				name: "password",
				description: "Password",
				type: "string",
				required: true,
			},
		],
	},
	{
		path: "/api/class",
		method: "GET",
		description: "Get all classes",
		access: "public",
		parameters: [],
	},
];
var str = JSON.stringify(routes, null, 2);
app.get("/", (req, res) => {
	res.send(str);
});

app.listen(PORT, () => {
	console.log(`Server running at: ${PORT}/`);
});
