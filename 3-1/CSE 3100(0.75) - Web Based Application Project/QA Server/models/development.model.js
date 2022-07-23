const { Sequelize, DataTypes } = require("sequelize");
const database = require("../database");
const User = require("./user.model");

const Development = database.define(
	"Development",

	{
		uuid: {
			type: Sequelize.UUID,
			allowNull: false,
			unique: true,
		},
		topic: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		details: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		posted_by: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		upvote_count: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		downvote_count: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		is_reported: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		is_acknowledged: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_in_progress: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		modelName: "Development",
		tableName: "development",
		timestamps: true,
		underscored: true,
		freezeTableName: true,
		updatedAt: "updated_at",
		createdAt: "created_at",
	}
);

Development.belongsTo(User, {
	foreignKey: "posted_by",
	as: "user",
});

// Development.sync({ alter: true })
// 	.then(() => console.log("Development table created"))
// 	.catch((error) => console.log(error));

module.exports = Development;
