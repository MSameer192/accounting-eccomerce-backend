const Supplier = require("../../models/Accounting/Supplier"); // Import your User model from Sequelize

const create = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(200).json({ data: supplier });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: `An error occurred while create supplier: ${error.message}`,
      });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) throw new Error("No such supplier!");

    // Use the where condition to specify the record to update
    await Supplier.update(req.body, {
      where: { id: id }, // Add your specific condition here
    });

    // Fetch the updated supplier record
    const updatedSupplier = await Supplier.findByPk(id);

    res.status(200).json({ data: updatedSupplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while updating the supplier: ${error.message}`,
    });
  }
};


const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) throw new Error("No such supplier!");
    res.status(200).json({ data: supplier });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: `An error occurred while getById supplier: ${error.message}`,
      });
  }
};

const getAll = async (req, res) => {
  try {
        const supplier = await Supplier.findAll({
      where: { user_id: req.user.userId },
      order: [["id", "DESC"]],
    });
    if (!supplier) throw new Error("No such supplier!");
    res.status(200).json({ data: supplier });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: `An error occurred while getAll supplier: ${error.message}`,
      });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.destroy({ where: { id } });
    res.status(200).json({ data: supplier });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: `An error occurred while remove supplier: ${error.message}`,
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
