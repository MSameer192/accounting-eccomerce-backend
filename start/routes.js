const cashRoute = require("../routes/cashRoute");
const error = require("../middleware/error");
const categoryRoute = require("../routes/categoryRoute");
const customerRoute = require("../routes/customerRoute");
const supplierRoute = require("../routes/Accounting/supplierRoute");
const productRoute = require("../routes/productRoute");
const purchaseOrderRoute = require("../routes/purchaseOrderRoute");
const userRoute = require("../routes/userRoute");
const purchaseOrderItemRoute = require("../routes/Inventory/purchaseOrderItemRoute");
const saleOrderItemRoute = require("../routes/Inventory/saleOrderItemRoute");
const saleOrderRoute = require("../routes/Inventory/saleOrderRoute");
const salesReport = require("../routes/Accounting/salesRoute");

module.exports = function (app) {
  app.use("/", cashRoute);
  app.use("/", categoryRoute);
  app.use("/", customerRoute);
  app.use("/", supplierRoute);
  app.use("/", productRoute);
  app.use("/", purchaseOrderRoute);
  app.use("/", userRoute);
  app.use("/", purchaseOrderItemRoute);
  app.use("/", saleOrderItemRoute);
  app.use("/", saleOrderRoute);
  app.use("/", salesReport);

  app.use(error);
};
