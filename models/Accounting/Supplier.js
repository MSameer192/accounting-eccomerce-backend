const sequelize = require("../../start/db");
const { Model, DataTypes } = require("sequelize");
const User = require("../Ecommerce/User");
const Platform = require("../Ecommerce/Platform");

// Defining model
class Supplier extends Model {}
Supplier.init(
  {
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // other model option go here
    sequelize, // connection instance
    tableName: "Supplier", // table name
  }
);

Supplier.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});

Supplier.belongsTo(Platform, {
  foreignKey: "platform_id",
  as: "platform",
  onDelete: "CASCADE",
});

module.exports = Supplier;
