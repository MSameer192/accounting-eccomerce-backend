const sequelize = require("../../start/db");
const { Model, DataTypes } = require("sequelize");
const User = require("../Ecommerce/User");
const Platform = require("../Ecommerce/Platform");
const Customer = require("../Accounting/Customer");
const SaleOrderItem = require("./SaleOrderItem");

// Defining model
class SaleOrder extends Model {}
SaleOrder.init(
  {
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taxFee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize, // connection instance
    tableName: "SaleOrder", // table name
  }
);

SaleOrder.hasMany(SaleOrderItem, {
  foreignKey: "sales_order_id",
  onDelete: "CASCADE",
});

SaleOrderItem.belongsTo(SaleOrder, {
  foreignKey: "sales_order_id",
  onDelete: "CASCADE",
});


SaleOrder.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});

SaleOrder.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "customer",
  onDelete: "CASCADE",
});

SaleOrder.belongsTo(Platform, {
  foreignKey: "platform_id",
  as: "platform",
  onDelete: "CASCADE",
});

module.exports = SaleOrder;