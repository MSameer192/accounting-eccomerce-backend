const express = require("express");
const router = express.Router();
// controller
const salesReportController = require("../../controllers/Accounting/salesReportsController");
// middleware
const protect = require("../../middleware/protect");

router.get(
  "/getSalesOrdersWithinDateRange",
  protect,
  salesReportController.getSalesOrdersWithinDateRange
);

router.get(
  "/getProductWiseReportSalesOrdersWithinDateRange",
  protect,
  salesReportController.getProductWiseSalesReportWithinDateRange
);

router.get(
  "/getSalesReportWithinDateRange",
  protect,
  salesReportController.getSalesReportWithinDateRange
);

router.get("/checking", salesReportController.checking);

router.get(
  "/getIncomeStatement",
  protect,
  salesReportController.getIncomeStatement
);

router.get(
  "/getBalanceSheet",
  protect,
  salesReportController.getBalanceSheet
);


module.exports = router;
