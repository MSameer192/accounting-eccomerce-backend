const CashTransactions = require("../models/Accounting/CashTransactions");
const Supplier = require("../models/Accounting/Supplier");
const PurchaseOrder = require("../models/Inventory/PurchaseOrder"); // Import your User model from Sequelize

// const create = async (req, res) => {
//     try {
//       const purchaseOrder = await PurchaseOrder.create(req.body);
//       res.status(200).json({ data: purchaseOrder });

//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: `An error occurred while create purchaseOrder: ${error.message}` });
//     }
//   };

const createPurchaseOrderAndCashTransaction = async (req, res) => {
  try {
    const { date, number, totalCost, paymentStatus, user_id, platform_id } =
      req.body;

    // Determine whether to save in debit or credit column based on paymentStatus
    let debitAmount, creditAmount;
    if (paymentStatus === "Not Paid") {
      debitAmount = 0;
      creditAmount = totalCost;
    } else if (paymentStatus === "Paid") {
      debitAmount = totalCost;
      creditAmount = 0;
    } else {
      // Handle other paymentStatus values as needed
      debitAmount = 0;
      creditAmount = 0;
    }

    // Create the PurchaseOrder record
    const purchaseOrder = await PurchaseOrder.create(req.body);

    // Create the CashTransactions record
    const cashTransaction = await CashTransactions.create({
      debit: debitAmount,
      credit: creditAmount,
      date: date,
      description: `Purchase Order # ${number}`,
      type: "Inventory",
      bankTransaction: "Yes",
      purchase_order_id: purchaseOrder.id,
      user_id,
      platform_id,
    });

    res.status(200).json({ data: { purchaseOrder, cashTransaction } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `An error occurred: ${error.message}` });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, number, totalCost } = req.body;

    const purchaseOrder = await PurchaseOrder.findByPk(id);

    if (!purchaseOrder) {
      throw new Error("No such PurchaseOrder!");
    }

    await purchaseOrder.update(req.body);

    // Update the CashTransactions record
    const cashTransaction = await CashTransactions.findOne({
      where: { purchase_order_id: purchaseOrder.id },
    });

    if (!cashTransaction) {
      throw new Error("No CashTransaction found for this PurchaseOrder!");
    }
    await cashTransaction.update({
      debit: totalCost,
      date: date,
      description: `Purchase Order # ${number}`,
    });

    res.status(200).json({ data: purchaseOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while updating purchaseOrder: ${error.message}`,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseOrder = await PurchaseOrder.findByPk(id);
    if (!purchaseOrder) throw new Error("No such PurchaseOrder!");
    res.status(200).json({ data: purchaseOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while getById purchaseOrder: ${error.message}`,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findAll({
      purchaseOrder: [["id", "ASC"]],
      include: {
        model: Supplier,
        as: "supplier",
        attributes: ["name", "id"],
      },
    });
    if (!purchaseOrder) throw new Error("No such PurchaseOrder!");
    res.status(200).json({ data: purchaseOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while getAll purchaseOrder: ${error.message}`,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseOrder = await PurchaseOrder.destroy({ where: { id } });
    res.status(200).json({ data: purchaseOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while remove purchaseOrder: ${error.message}`,
    });
  }
};

module.exports = {
  // create,
  update,
  getById,
  getAll,
  remove,
  createPurchaseOrderAndCashTransaction,
};
