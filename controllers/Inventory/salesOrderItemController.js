const Product = require("../../models/Inventory/Product");
const SaleOrderItem = require("../../models/Inventory/SaleOrderItem"); // Import your User model from Sequelize

const create = async (req, res) => {
  try {
    const saleOrderItem = await SaleOrderItem.bulkCreate(req.body);
    // Assuming you have an array of productId(s) in your request body
    res.status(200).json({ data: saleOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while create saleOrderItem: ${error.message}`,
    });
  }
};

const update = async (req, res) => {
  try {
    // const { id } = req.params;
    console.log(
      "🚀 ~ file: saleOrderItemController.js:20 ~ update ~ req.body:",
      req.body
    );
    const saleOrderItem = await SaleOrderItem.bulkCreate(req.body, {
      updateOnDuplicate: ["quantitySold", "unitPrice", "totalPrice"],
    });
    // if (!saleOrderItem) throw new Error("No such SaleOrderItem!");
    // await saleOrderItem.update(req.body);
    res.status(200).json({ data: saleOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while update saleOrderItem: ${error.message}`,
    });
  }
};

const findByQueryParam = async (req, res) => {
  try {
    const saleOrderItem = await SaleOrderItem.findAll({
      where: req.query,
      order: [["id", "DESC"]],
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });
    if (!saleOrderItem) throw new Error("No such SaleOrderItem!");
    res.status(200).json({ data: saleOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while findByQueryParam saleOrderItem: ${error.message}`,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const saleOrderItem = await SaleOrderItem.findByPk(id);
    // const saleOrderItem = await SaleOrderItem.findAll({ where: {institute_id: id}, order: [['id', 'DESC']], include: [{
    //   model: Institute,
    //   as: 'institute'
    // }] });
    if (!saleOrderItem) throw new Error("No such SaleOrderItem!");
    res.status(200).json({ data: saleOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while getById saleOrderItem: ${error.message}`,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const saleOrderItem = await SaleOrderItem.findAll({
      where: { user_id: req.user.userId },
      order: [["id", "DESC"]],
    });
    if (!saleOrderItem) throw new Error("No such Product Item!");
    res.status(200).json({ data: saleOrderItem });
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
    const saleOrderItem = await SaleOrderItem.destroy({
      where: { id },
    });
    res.status(200).json({ data: saleOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while remove saleOrderItem: ${error.message}`,
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
