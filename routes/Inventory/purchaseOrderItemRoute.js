const express = require("express");
const router = express.Router();
// controller
const purchaseOrderItemController = require("../../controllers/Inventory/purchaseOrderItemController");
// middleware
const protect = require("../../middleware/protect");

router.post("/purchaseOrderItem", purchaseOrderItemController.create);

router.patch("/purchaseOrderItem", purchaseOrderItemController.update);

router.get("/purchaseOrderItem", protect, purchaseOrderItemController.getAll);

router.get("/purchaseOrderItem/find", purchaseOrderItemController.findByQueryParam);

router.get("/purchaseOrderItem/:id", purchaseOrderItemController.getById);

router.delete("/purchaseOrderItem/:id", purchaseOrderItemController.remove);

module.exports = router;
