const { Sequelize, DataTypes } = require("sequelize");
const database = require("../database");

const Role = database.define(
	"Role",
	{
		uuid: {
			type: Sequelize.UUID,
			allowNull: false,
			unique: true,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_student: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_teacher: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_guardian: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_school_admin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_admin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_superadmin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		modelName: "Role",
		tableName: "role",
		timestamps: true,
		underscored: true,
		freezeTableName: true,
		updatedAt: "updated_at",
		createdAt: "created_at",
	}
);

// Role.sync({ alter: true })
// 	.then(() => console.log("Role table created"))
// 	.catch((error) => console.log("Error creating Role table"));//

module.exports = Role;
