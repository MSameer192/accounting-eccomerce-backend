const sequelize = require("../../start/db");
const { Model, DataTypes } = require("sequelize");
const User = require("../Ecommerce/User");
const Platform = require("../Ecommerce/Platform");
const Product = require("./Product");

// Defining model

class SaleOrderItem extends Model {}
SaleOrderItem.init(
  {
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantitySold: {
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
    taxFee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // other model option go here
    sequelize, // connection instance
    tableName: "SaleOrderItem", // table name
  }
);

Product.hasMany(SaleOrderItem, {
  foreignKey: "skuId",
  onDelete: "CASCADE",
  as: "prodcutSaleOrderItems",
});

SaleOrderItem.belongsTo(Product, {
  foreignKey: "skuId",
  as: "product",
  onDelete: "CASCADE",
});



// SaleOrderItem.associate = (models) => {
//   Product.hasMany(models.SaleOrderItem);
// };

// SaleOrderItem.belongsToMany(Product, {
//   // foreignKey: "skuId",
//   // as: "product",
//   // onDelete: "CASCADE",
//   through: "ProductSaleOrder",
// });

// Product.belongsToMany(SaleOrderItem, {
//   // foreignKey: "saleOrderItemId",
//   // as: "SaleOrderItem",
//   // onDelete: "CASCADE",
//   through: "ProductSaleOrder",
// });

SaleOrderItem.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});

SaleOrderItem.belongsTo(Platform, {
  foreignKey: "platform_id",
  as: "platform",
  onDelete: "CASCADE",
});

module.exports = SaleOrderItem;
