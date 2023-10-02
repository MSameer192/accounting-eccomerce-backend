
const sequelize = require("../../start/db");
const { Model, DataTypes } = require("sequelize");
const User = require("../Ecommerce/User");
const Category = require("../Inventory/Category");
const Platform = require("../Ecommerce/Platform");
const SaleOrderItem = require("./SaleOrderItem");
// Defining model

class Product extends Model {}
Product.init(
  {
    skuId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cogs: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // other model option go here
    sequelize, // connection instance
    tableName: "Product", // table name
  }
);

Product.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
  onDelete: "CASCADE",
});

Product.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});

Product.belongsTo(Platform, {
  foreignKey: "platform_id",
  as: "platform",
  onDelete: "CASCADE",
});

module.exports = Product;
