const sequelize = require("../../start/db");
const { Model, DataTypes } = require("sequelize");
const User = require("../Ecommerce/User");
const Supplier = require("../Accounting/Supplier");
const Platform = require("../Ecommerce/Platform");

// Defining model
class PurchaseOrder extends Model {}
PurchaseOrder.init(
  {
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    arrivalDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mainMarketPlace: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    carrier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    extraCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // other model option go here
    sequelize, // connection instance
    tableName: "purchaseOrder", // table name
  }
);

PurchaseOrder.belongsTo(Supplier, {
  foreignKey: "supplier_id",
  as: "supplier",
  onDelete: "CASCADE",
});


PurchaseOrder.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});

PurchaseOrder.belongsTo(Platform, {
  foreignKey: "platform_id",
  as: "platform",
  onDelete: "CASCADE",
});

module.exports = PurchaseOrder;
