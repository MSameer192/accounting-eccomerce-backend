const CashTransactions = require("../../models/Accounting/CashTransactions");
const Customer = require("../../models/Accounting/Customer");
const Supplier = require("../../models/Accounting/Supplier");
const SaleOrder = require("../../models/Inventory/SaleOrder"); // Import your User model from Sequelize

// const create = async (req, res) => {
//     try {
//       const saleOrder = await SaleOrder.create(req.body);
//       res.status(200).json({ data: saleOrder });

//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: `An error occurred while create saleOrder: ${error.message}` });
//     }
//   };

const createSaleOrderAndCashTransaction = async (req, res) => {
  try {
    const { date, number, totalPrice, user_id, platform_id, status, taxFee } =
      req.body;

    let price;
    let fee;
    if (status === "Refund") {
      price = -totalPrice; // Make the amount negative for refunds
      fee = -taxFee;
    } else {
      price = totalPrice;
      fee = taxFee;
    }

    // Create the SaleOrder record
    const saleOrder = await SaleOrder.create({
      ...req.body,
      totalPrice: price,
      taxFee: fee,
    });
    // Create the CashTransactions record
    const cashTransaction = await CashTransactions.create({
      credit: totalPrice,
      date: date,
      description: `Sale Order # ${number}`,
      type: "Revenue",
      bankTransaction: "Yes",
      sale_order_id: saleOrder.id,
      user_id,
      platform_id,
    });

    res.status(200).json({ data: { saleOrder, cashTransaction } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `An error occurred: ${error.message}` });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, number, totalPrice, taxFee, status } = req.body;

    const saleOrder = await SaleOrder.findByPk(id);
    if (!saleOrder) throw new Error("No such SaleOrder!");

    let price = totalPrice || saleOrder.totalPrice;
    let fee = taxFee || saleOrder.taxFee;

    if (status === "Refund") {
      price = -Math.abs(price); // Make the amount negative for refunds
      fee = -Math.abs(fee);
      console.log("refund inside");
    } else {
      price = Math.abs(price); // Make the amount positive for completed orders
      fee = Math.abs(fee);
      console.log("refund outside");
    }

    await saleOrder.update({
      ...req.body,
      totalPrice: price,
      taxFee: fee,
      status: status,
    });

    // await saleOrder.update({
    //   ...req.body,
    //   totalPrice: status === "Refund" ? -totalPrice || -saleOrder.totalPrice : totalPrice || saleOrder.totalPrice ,
    //   taxFee: status === "Refund" ? taxFee || saleOrder.taxFee : taxFee || saleOrder.taxFee ,
    //   status: status,
    // });

    const cashTransaction = await CashTransactions.findOne({
      where: { sale_order_id: saleOrder.id },
    });

    if (!cashTransaction) {
      throw new Error("No CashTransaction found for this PurchaseOrder!");
    }
    await cashTransaction.update({
      debit: totalPrice,
      date: date,
      description: `Purchase Order # ${number}`,
    });

    res.status(200).json({ data: saleOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while update saleOrder: ${error.message}`,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const saleOrder = await SaleOrder.findByPk(id);
    if (!saleOrder) throw new Error("No such SaleOrder!");
    res.status(200).json({ data: saleOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while getById saleOrder: ${error.message}`,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const saleOrder = await SaleOrder.findAll({
      saleOrder: [["id", "ASC"]],
      include: {
        model: Customer,
        as: "customer",
        attributes: ["name", "id"],
      },
    });
    if (!saleOrder) throw new Error("No such SaleOrder!");
    res.status(200).json({ data: saleOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while getAll saleOrder: ${error.message}`,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const saleOrder = await SaleOrder.destroy({ where: { id } });
    res.status(200).json({ data: saleOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while remove saleOrder: ${error.message}`,
    });
  }
};

module.exports = {
  // create,
  update,
  getById,
  getAll,
  remove,
  createSaleOrderAndCashTransaction,
};
