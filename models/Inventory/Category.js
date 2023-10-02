const sequelize = require("../../start/db");
const { Model, DataTypes } = require("sequelize");
const User = require("../Ecommerce/User");
const Platform = require("../Ecommerce/Platform");

// Defining model
class Category extends Model {}
Category.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    // other model option go here
    sequelize, // connection instance
    tableName: "productCategory", // table name
  }
);

Category.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});

Category.belongsTo(Platform, {
  foreignKey: "platform_id",
  as: "platform",
  onDelete: "CASCADE",
});

module.exports = Category;