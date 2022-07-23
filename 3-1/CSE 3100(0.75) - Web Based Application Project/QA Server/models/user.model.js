const { Sequelize, DataTypes } = require("sequelize");
const database = require("../database");
const Role = require("./role.model");

const User = database.define(
	"User",
	{
		uuid: {
			type: Sequelize.UUID,
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		biometric_info: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		about_me: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		date_of_birth: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		blood_group: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		profession: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		role_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		profile_picture: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		social_auth_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		cover_picture: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		life: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 5,
		},
		life_string: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "0|0|0|0|0",
		},
		score: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		zcoins: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		otp_code: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		otp_expiry: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		reffer_code: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_verified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		modelName: "User",
		tableName: "user",
		timestamps: true,
		underscored: true,
		freezeTableName: true,
		updatedAt: "updated_at",
		createdAt: "created_at",
	}
);

User.belongsTo(Role, {
	foreignKey: "role_id",
	as: "role",
});

// // User.belongsTo(SocialAuth, {
// // 	foreignKey: "social_auth_id",
// // 	as: "social_auth",
// // });

// User.sync({ alter: true })
// 	.then(() => console.log("User table created"))
// 	.catch((error) => console.log("Error creating User table", error));

module.exports = User;
