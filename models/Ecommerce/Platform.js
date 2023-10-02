const sequelize = require("../../start/db");
const { Model, DataTypes } = require("sequelize");

// Defining model
class Platform extends Model {}
Platform.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // other model option go here
    sequelize, // connection instance
    tableName: "Platform", // table name
  }
);


module.exports = Platform;