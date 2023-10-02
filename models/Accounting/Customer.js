const sequelize = require("../../start/db");
const { Model, DataTypes } = require("sequelize");
const User = require("../Ecommerce/User");
const Platform = require("../Ecommerce/Platform");

// Defining model
class Customer extends Model {}
Customer.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // other model option go here
    sequelize, // connection instance
    tableName: "Customer", // table name
  }
);

// Customer.belongsTo(Order, {
//     foreignKey: "order_id",
//     as: "order",
//     onDelete: "CASCADE",
// });

Customer.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    onDelete: "CASCADE",
});

Customer.belongsTo(Platform, {
  foreignKey: "platform_id",
  as: "platform",
  onDelete: "CASCADE",
});
module.exports = Customer;