const Product = require("../../models/Inventory/Product");
const PurchaseOrderItem = require("../../models/Inventory/PurchaseOrderItem"); // Import your User model from Sequelize

const create = async (req, res) => {
  try {
    const purchaseOrderItem = await PurchaseOrderItem.bulkCreate(req.body);
    res.status(200).json({ data: purchaseOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while create purchaseOrderItem: ${error.message}`,
    });
  }
};

const update = async (req, res) => {
  try {
    // const { id } = req.params;
    console.log("🚀 ~ file: purchaseOrderItemController.js:20 ~ update ~ req.body:", req.body)
    const purchaseOrderItem = await PurchaseOrderItem.bulkCreate(req.body, { updateOnDuplicate: ['quantityOrdered', 'unitPrice', 'totalPrice'] });
    // if (!purchaseOrderItem) throw new Error("No such PurchaseOrderItem!");
    // await purchaseOrderItem.update(req.body);
    res.status(200).json({ data: purchaseOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while update purchaseOrderItem: ${error.message}`,
    });
  }
};

const findByQueryParam = async (req, res) => {
  try {
    const purchaseOrderItem = await PurchaseOrderItem.findAll({
      where: req.query,
      order: [["id", "DESC"]],
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });
    if (!purchaseOrderItem) throw new Error("No such PurchaseOrderItem!");
    res.status(200).json({ data: purchaseOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while findByQueryParam purchaseOrderItem: ${error.message}`,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseOrderItem = await PurchaseOrderItem.findByPk(id);
    // const purchaseOrderItem = await PurchaseOrderItem.findAll({ where: {institute_id: id}, order: [['id', 'DESC']], include: [{
    //   model: Institute,
    //   as: 'institute'
    // }] });
    if (!purchaseOrderItem) throw new Error("No such PurchaseOrderItem!");
    res.status(200).json({ data: purchaseOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while getById purchaseOrderItem: ${error.message}`,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const purchaseOrderItem = await PurchaseOrderItem.findAll({
      where: { user_id: req.user.userId },
      order: [["id", "DESC"]],
    });
    if (!purchaseOrderItem) throw new Error("No such Product Item!");
    res.status(200).json({ data: purchaseOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while getAll product item: ${error.message}`,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseOrderItem = await PurchaseOrderItem.destroy({
      where: { id },
    });
    res.status(200).json({ data: purchaseOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while remove purchaseOrderItem: ${error.message}`,
    });
  }
};

module.exports = {
  create,
  update,
  getById,
  getAll,
  remove,
  findByQueryParam,
};
