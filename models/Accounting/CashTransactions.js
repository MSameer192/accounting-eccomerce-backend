const sequelize = require("../../start/db");
const { Model, DataTypes } = require("sequelize");
const User = require("../Ecommerce/User");
const Platform = require("../Ecommerce/Platform");
const PurchaseOrder = require("../Inventory/PurchaseOrder");
const SaleOrder = require("../Inventory/SaleOrder");

// Defining model
class CashTransactions extends Model {}
CashTransactions.init(
  {
    debit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    credit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false /*(assets, liabilities, equity, revenue, expenses, withdrawal, investment, capital)*/,
    },
    bankTransaction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // other model option go here
    sequelize, // connection instance
    tableName: "CashTransactions", // table name
  }
);

CashTransactions.belongsTo(PurchaseOrder, {
  foreignKey: "purchase_order_id",
  as: "purchaseOrder",
  onDelete: "CASCADE",
});

CashTransactions.belongsTo(SaleOrder, {
  foreignKey: "sale_order_id",
  as: "saleOrder",
  onDelete: "CASCADE",
});

CashTransactions.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});

CashTransactions.belongsTo(Platform, {
  foreignKey: "platform_id",
  as: "platform",
  onDelete: "CASCADE",
});

module.exports = CashTransactions;
