const { Sequelize, DataTypes } = require("sequelize");
const database = require("../database");
const User = require("./user.model");
// const Subject_x_Class = require("./subject_x_class.model");

const Course = database.define(
	"Course",
	{
		uuid: {
			type: Sequelize.UUID,
			allowNull: false,
			unique: true,
		},
		course_code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		number_of_students: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		number_of_quizes: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		number_of_materials: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		number_of_books: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		average_score: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		course_rating: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		subject_x_class_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		class_start_time: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		class_end_time: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		invitation_link: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		meeting_link: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		course_hour: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		completed_hour: {
			type: DataTypes.FLOAT,
			allowNull: true,
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
	},
	{
		modelName: "Course",
		tableName: "course",
		timestamps: true,
		underscored: true,
		freezeTableName: true,
		updatedAt: "updated_at",
		createdAt: "created_at",
	}
);

// Subject_x_Class.hasMany(Course, {
// 	as: "subject",
// 	foreignKey: "subject_x_class_id",
// });
// Course.belongsTo(Subject_x_Class, {
// 	as: "subject",
// 	foreignKey: "subject_x_class_id",
// });

User.hasMany(Course, {
	as: "owner",
	foreignKey: "created_by",
});
Course.belongsTo(User, {
	as: "owner",
	foreignKey: "created_by",
});

// Course.sync({ alter: true })
// 	.then(() => console.log("Course table created successfully"))
// 	.catch((err) => console.log("Error creating Course table", err));

module.exports = Course;
