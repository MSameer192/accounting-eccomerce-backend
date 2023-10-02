const sequelize = require("../../start/db");
const { Model, DataTypes } = require("sequelize");

// Defining model
class User extends Model {}
User.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, 
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    // other model option go here
    sequelize, // connection instance
    tableName: "user", // table name
  }
);

module.exports = User;