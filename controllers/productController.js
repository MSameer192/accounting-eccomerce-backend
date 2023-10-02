const Category = require("../models/Inventory/Category");
const Product = require("../models/Inventory/Product");
const PurchaseOrderItem = require("../models/Inventory/PurchaseOrderItem");
const SaleOrderItem = require("../models/Inventory/SaleOrderItem");

const create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const findProduct = await Product.findByPk(product.skuId, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json({ data: findProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while create product: ${error.message}`,
    });
  }
};

const update = async (req, res) => {
  try {
    const { skuId } = req.params;
    const product = await Product.findByPk(skuId, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
    });
    if (!product) throw new Error("No such Product!");
    await product.update(req.body);
    res.status(200).json({ data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while update product: ${error.message}`,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { skuId } = req.params;
    const product = await Product.findByPk(skuId);
    if (!product) throw new Error("No such Product!");
    res.status(200).json({ data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while getById product: ${error.message}`,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { user_id: req.user.userId },
      order: [["skuId", "DESC"]],
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const purchaseOrderItems = await PurchaseOrderItem.findAll({
      where: { user_id: req.user.userId },
      order: [["skuId", "DESC"]],
    });

    const SaleOrderItems = await SaleOrderItem.findAll({
      where: { user_id: req.user.userId },
      order: [["skuId", "DESC"]],
    });

    const totalOrderedQty = {};
    const totalSoldQty = {};

    purchaseOrderItems.forEach((item) => {
      const { skuId, quantityOrdered } = item;
      const parsedQuantityOrdered = parseInt(quantityOrdered, 10);

      if (!totalOrderedQty[skuId]) {
        totalOrderedQty[skuId] = parsedQuantityOrdered;
      } else {
        totalOrderedQty[skuId] += parsedQuantityOrdered;
      }
    });

    SaleOrderItems.forEach((item) => {
      const { skuId, quantitySold } = item;
      const parsedQuantitySold = parseInt(quantitySold, 10);

      if (!totalSoldQty[skuId]) {
        totalSoldQty[skuId] = parsedQuantitySold;
      } else {
        totalSoldQty[skuId] += parsedQuantitySold;
      }
    });

    const productsWithQuantities = products.map((product) => {
      const { skuId, cogs } = product;
      const totalOrderedQuantity = totalOrderedQty[skuId] || 0;
      const totalSoldQuantity = totalSoldQty[skuId] || 0;

      // Calculate balanceQuantity
      const balanceQuantity = totalOrderedQuantity - totalSoldQuantity;

      // Calculate balanceValue (balanceQuantity * cogs)
      const balanceValue = balanceQuantity * cogs;

      return {
        ...product.toJSON(),
        totalOrderedQty: totalOrderedQuantity,
        totalSoldQty: totalSoldQuantity,
        balanceQuantity: balanceQuantity,
        balanceValue: balanceValue, // Include balanceValue in the response
      };
    });

    res.status(200).json({ data: productsWithQuantities });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while getAll products: ${error.message}`,
    });
  }
};


const remove = async (req, res) => {
  try {
    const { skuId } = req.params;
    const product = await Product.destroy({ where: { skuId } });
    res.status(200).json({ data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while remove product: ${error.message}`,
    });
  }
};

module.exports = {
  create,
  update,
  getById,
  getAll,
  remove,
};
