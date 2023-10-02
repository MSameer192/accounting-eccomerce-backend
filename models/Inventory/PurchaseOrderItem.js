const sequelize = require("../../start/db");
const { Model, DataTypes } = require("sequelize");
const User = require("../Ecommerce/User");
const Platform = require("../Ecommerce/Platform");
const Product = require("./Product");
const PurchaseOrder = require("./PurchaseOrder");

// Defining model
class PurchaseOrderItem extends Model {}
PurchaseOrderItem.init(
  {
    quantityOrdered: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // other model option go here
    sequelize, // connection instance
    tableName: "PurchaseOrderItem", // table name
  }
);

Product.hasMany(PurchaseOrderItem, {
  foreignKey: "skuId",
  onDelete: "CASCADE",
  as: "prodcutPurchaseOrderItems",
});

PurchaseOrderItem.belongsTo(Product, {
  foreignKey: "skuId",
  as: "product",
  onDelete: "CASCADE",
});

PurchaseOrderItem.belongsTo(PurchaseOrder, {
  foreignKey: "purchase_order_id",
  as: "puchase_order",
  onDelete: "CASCADE",
});

PurchaseOrderItem.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});

PurchaseOrderItem.belongsTo(Platform, {
  foreignKey: "platform_id",
  as: "platform",
  onDelete: "CASCADE",
});

module.exports = PurchaseOrderItem;
