const express = require("express");
const router = express.Router();
// controller
const salesOrderItemController = require("../../controllers/Inventory/salesOrderItemController");
// middleware
const protect = require("../../middleware/protect");

router.post("/saleOrderItem", salesOrderItemController.create);

router.patch("/saleOrderItem", salesOrderItemController.update);

router.get("/saleOrderItem", protect, salesOrderItemController.getAll);

router.get("/saleOrderItem/find", salesOrderItemController.findByQueryParam);

router.get("/saleOrderItem/:id", salesOrderItemController.getById);

router.delete("/saleOrderItem/:id", salesOrderItemController.remove);

module.exports = router;
