const CashTransactions = require("../../models/Accounting/CashTransactions");
const Product = require("../../models/Inventory/Product");
const PurchaseOrder = require("../../models/Inventory/PurchaseOrder");
const PurchaseOrderItem = require("../../models/Inventory/PurchaseOrderItem");
const SaleOrder = require("../../models/Inventory/SaleOrder");
const SaleOrderItem = require("../../models/Inventory/SaleOrderItem");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

const getSalesReportWithinDateRange = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    // Step 1: Fetch all sales within the date range for the user
    const sales = await SaleOrder.findAll({
      where: {
        date: {
          [Op.between]: [fromDate, toDate],
        },
        user_id: req.user.userId,
      },
    });

    // Step 2: Fetch all sale order items within the date range for the user
    const saleOrderItems = await SaleOrderItem.findAll({
      where: {
        date: {
          [Op.between]: [fromDate, toDate],
        },
        user_id: req.user.userId,
      },
    });

    // Step 3: Fetch products for the user
    const products = await Product.findAll({
      where: {
        user_id: req.user.userId,
      },
    });

    // Step 4: Calculate the total sales (Sum of All Sales.totalPrice)
    const totalSales = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);

    // Step 5: Calculate the total orders (Count of all Sales objects)
    const totalOrders = sales.length;

    // Step 6: Calculate the sold units (Sum of all quantitySold of saleOrderItems)
    const soldUnits = saleOrderItems.reduce(
      (sum, item) => sum + item.quantitySold,
      0
    );

    // Step 7: Calculate the total taxes (Sum of all taxFee of Sales)
    const totalTaxes = sales.reduce((sum, sale) => sum + sale.taxFee, 0);

    // Step 8: Calculate the total cost of goods (Sum of quantitySold * product.cogs)
    const totalCostOfGoods = saleOrderItems.reduce((sum, item) => {
      const product = products.find((product) => product.skuId === item.skuId);
      if (product) {
        return sum + item.quantitySold * product.cogs;
      }
      return sum;
    }, 0);

    // Step 9: Calculate the gross profit (TotalSales - TotalTaxes - TotalCostOfGoods)
    const grossProfit = totalSales - totalTaxes - totalCostOfGoods;

    // Step 10: Calculate the refunded orders (Count of all Sale objects with status === "Refund")
    const refundedOrders = sales.filter(
      (sale) => sale.status === "Refund"
    ).length;

    // Step 11: Respond with the sales report
    res.status(200).json({
      status: "success",
      data: {
        totalSales,
        totalOrders,
        soldUnits,
        totalTaxes,
        totalCostOfGoods,
        grossProfit,
        refundedOrders,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checking = async (req, res) => {
  try {
    // const { fromDate, toDate } = req.query; // Get date range from request query parameters

    // Find sales orders within the specified date range
    const product = await Product.findAll({
      include: [
        {
          model: SaleOrderItem,
          as: "prodcutSaleOrderItems",
        },
      ],
    });

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSalesOrdersWithinDateRange = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query; // Get date range from request query parameters

    // Find sales orders within the specified date range
    // const salesOrders = await SaleOrder.findAll({
    //   where: {
    //     date: {
    //       [Op.between]: [fromDate, toDate],
    //     },
    //   },
    //   include: [
    //     {
    //       model: SaleOrderItem,
    //       as: "SaleOrderItems",
    //       include: [
    //         {
    //           model: Product,
    //           as: "product",
    //           foreignKey: "skuId", // Specify the custom foreign key
    //         },
    //       ],
    //     },
    //   ],
    // });

    const salesOrdersWithCalculations = await SaleOrder.findAll({
      attributes: [
        "id",
        "totalPrice",
        "number",
        "date",
        "status",
        "taxFee",
        "createdAt",
        "updatedAt",
        "user_id",
        "customer_id",
        [
          Sequelize.literal(
            '(SELECT SUM("quantitySold") FROM "SaleOrderItem" WHERE "SaleOrderItem"."sales_order_id" = "SaleOrder"."id")'
          ),
          "unitSold",
        ],
        [
          Sequelize.literal(
            '(SELECT SUM("quantitySold" * "product"."cogs") FROM "SaleOrderItem" INNER JOIN "Product" AS "product" ON "SaleOrderItem"."skuId" = "product"."skuId" WHERE "SaleOrderItem"."sales_order_id" = "SaleOrder"."id")'
          ),
          "costOfGoods",
        ],
        [
          Sequelize.literal(
            '("SaleOrder"."totalPrice" - (SELECT SUM("quantitySold" * "product"."cogs") FROM "SaleOrderItem" INNER JOIN "Product" AS "product" ON "SaleOrderItem"."skuId" = "product"."skuId" WHERE "SaleOrderItem"."sales_order_id" = "SaleOrder"."id") - "SaleOrder"."taxFee")'
          ),
          "profit",
        ],
      ],
      include: [
        {
          model: SaleOrderItem,
          as: "SaleOrderItems",
          include: [
            {
              model: Product,
              as: "product",
              foreignKey: "skuId", // Specify the custom foreign key
            },
          ],
        },
      ],
      where: {
        date: {
          [Op.between]: [fromDate, toDate],
        },
      },
      group: [
        "SaleOrder.id",
        "SaleOrderItems.id",
        "SaleOrderItems->product.skuId",
      ],
    });
    res.status(200).json({
      status: "success",
      data: salesOrdersWithCalculations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductWiseSalesReportWithinDateRange = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    // Step 1: Fetch products for the user
    const products = await Product.findAll({
      where: {
        user_id: req.user.userId,
      },
    });

    // Step 2: Fetch sales order items within the date range for the user
    const saleOrderItems = await SaleOrderItem.findAll({
      where: {
        date: {
          [Op.between]: [fromDate, toDate],
        },
        user_id: req.user.userId,
      },
    });

    // Step 3: Initialize a map to store product-wise calculations
    const productReportMap = new Map();

    // Step 4: Calculate product-wise sales report
    saleOrderItems.forEach((saleOrderItem) => {
      const { skuId, quantitySold, totalPrice, taxFee } = saleOrderItem;

      if (!productReportMap.has(skuId)) {
        // Initialize product report object
        productReportMap.set(skuId, {
          quantitySold: 0,
          totalSales: 0,
          totalCostOfGoods: 0,
          totalTaxes: 0,
          profit: 0, // Initialize profit
          productDetails: null, // Placeholder for product details
        });
      }

      // Update product-wise calculations
      const productReport = productReportMap.get(skuId);
      productReport.quantitySold += quantitySold;
      productReport.totalSales += totalPrice;
      productReport.totalTaxes += taxFee;

      // Find the product's cost of goods (you need to define the COGS field in your Product model)
      const product = products.find((product) => product.skuId === skuId);
      if (product) {
        productReport.totalCostOfGoods += quantitySold * product.cogs;
        productReport.productDetails = product; // Include product details
        productReport.profit =
          productReport.totalSales -
          productReport.totalCostOfGoods -
          productReport.totalTaxes; // Calculate profit
      }
    });

    // Step 5: Convert the map to an array of objects
    const productWiseSalesReport = Array.from(
      productReportMap,
      ([skuId, report]) => report
    );

    // Step 6: Respond with the product-wise sales report including product details and profit
    res.status(200).json({
      status: "success",
      data: productWiseSalesReport,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getIncomeStatement = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const { userId } = req.user;

    // Common where object with user_id filter
    const commonWhere = {
      user_id: userId,
      date: {
        [Op.between]: [fromDate, toDate],
      },
    };

    const salesData = await SaleOrder.findAll({
      attributes: [
        [
          SaleOrder.sequelize.fn("sum", SaleOrder.sequelize.col("totalPrice")),
          "serviceRevenue",
        ],
        [
          SaleOrder.sequelize.fn("sum", SaleOrder.sequelize.col("taxFee")),
          "amazonFee",
        ],
      ],
      where: commonWhere,
    });

    const { serviceRevenue, amazonFee } = salesData[0].dataValues;

    // Calculate Cost of Goods Sold using Sequelize include
    const saleOrderItems = await SaleOrderItem.findAll({
      where: commonWhere,
      include: [
        {
          model: Product,
          as: "product", // This should match your association alias
        },
      ],
    });

    let costOfGoodsSold = 0;
    for (const item of saleOrderItems) {
      if (item.product) {
        costOfGoodsSold += item.product.cogs * item.quantitySold;
      }
    }

    // Calculate Gross Profit
    const grossProfit = serviceRevenue - amazonFee - costOfGoodsSold;

    // Calculate Expenses (including data)
    const expensesData = await CashTransactions.findAll({
      where: {
        ...commonWhere,
        type: "Expenses",
        bankTransaction: "Yes",
      },
    });

    // Calculate the sum of debit amounts
    const expenses = expensesData.reduce(
      (total, transaction) => total + transaction.debit,
      0
    );

    // Calculate Profit Before Income Tax
    const profitBeforeIncomeTax = grossProfit - expenses;

    // Calculate Tax Value
    const taxValue = profitBeforeIncomeTax * 0.19;

    // Calculate Profit After Tax
    const profitAfterTax = profitBeforeIncomeTax - taxValue;

    res.json({
      serviceRevenue,
      amazonFee,
      costOfGoodsSold,
      grossProfit,
      expenses,
      profitBeforeIncomeTax,
      taxValue,
      profitAfterTax,
      expensesData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBalanceSheet = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const userId = req.user.userId;

    // Common where clause for date and user filtering
    const commonWhere = {
      user_id: userId,
      date: {
        [Op.between]: [fromDate, toDate],
      },
    };

    // Calculate Cash & Bank Balances
    const cash = await CashTransactions.findAll({
      attributes: [
        [
          CashTransactions.sequelize.fn(
            "sum",
            CashTransactions.sequelize.col("credit")
          ),
          "credit",
        ],
        [
          CashTransactions.sequelize.fn(
            "sum",
            CashTransactions.sequelize.col("debit")
          ),
          "debit",
        ],
      ],
      where: {
        ...commonWhere,
        bankTransaction: "Yes",
      },
    });

    const { credit, debit } = cash[0].dataValues;

    const cashAndBankBalances = credit - debit;

    // Calculate Accounts Receivable
    const accountsReceivable = await CashTransactions.sum("debit", {
      where: {
        ...commonWhere,
        bankTransaction: "Yes",
        type: "Receivable",
      },
    });

    // Calculate Fixed Assets
    const fixedAssets = await CashTransactions.sum("debit", {
      where: {
        ...commonWhere,
        bankTransaction: "No",
        type: "Fixed Assets",
      },
    });

    // Calculate Pre-Payments
    const prePayments = await PurchaseOrder.sum("totalCost", {
      where: {
        ...commonWhere,
        status: {
          [Op.or]: ["Back Orders", "Pending"],
        },
      },
    });

    const result = await PurchaseOrderItem.findAndCountAll({
      attributes: [
        [
          Sequelize.literal('SUM("unitPrice" * "quantityOrdered")'),
          "totalPurchased",
        ],
      ],
      where: commonWhere,
    });

    // The totalPurchased sum will be available in the result.rows array
    const totalPurchased = result.rows[0].get("totalPurchased");

    console.log("Total Purchased:", totalPurchased);

    const sold = await SaleOrderItem.findAll({
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal('"quantitySold" * "product"."cogs"')
          ),
          "totalSold",
        ],
      ],
      include: [
        {
          model: Product,
          as: "product", // Use the same alias here
          foreignKey: "skuId",
          attributes: [],
        },
      ],
      where: commonWhere,
      raw: true,
    });

    const totalSold = sold[0].totalSold;

    const remainingInventory = totalPurchased - totalSold;

    const totalAssets =
      cashAndBankBalances +
      accountsReceivable +
      fixedAssets +
      prePayments +
      remainingInventory;

    // Calculate Account Payable
    const inventoryOnCredit = await PurchaseOrder.sum("totalCost", {
      where: {
        ...commonWhere,
        paymentStatus: "Not Paid",
      },
    });

    const payable = await CashTransactions.sum("credit", {
      where: {
        ...commonWhere,
        type: "Payable",
        bankTransaction: "Yes",

      },
    });

    const accountsPayable = inventoryOnCredit + payable;

    const payableTax = await CashTransactions.sum("credit", {
      where: {
        ...commonWhere,
        type: "Tax",
        bankTransaction: "No",
      },
    });

    const withdrawal = await CashTransactions.sum("debit", {
      where: {
        ...commonWhere,
        type: "Withdrawal",
        bankTransaction: "Yes",
      },
    });


    // Create and send the balance sheet response
    const balanceSheet = {
      assets: [
        {
          cashAndBankBalances,
          accountsReceivable,
          fixedAssets,
          prePayments,
          remainingInventory,
          totalAssets,
        },
      ],

      equityAndlaibility: [
        {
          accountsPayable,
          payableTax,
          withdrawal
        },
      ],
    };

    res.json(balanceSheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBalanceSheet,
};

module.exports = {
  getSalesReportWithinDateRange,
  getSalesOrdersWithinDateRange,
  getProductWiseSalesReportWithinDateRange,
  checking,
  getIncomeStatement,
  getBalanceSheet,
};
