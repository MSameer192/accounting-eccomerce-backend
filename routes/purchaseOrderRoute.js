const express = require("express");
const router = express.Router();
// controller
const purchaseOrderController = require("../controllers/purchaseOrderController");
// middleware
const protect = require("../middleware/protect");

router.post("/purchaseOrder", purchaseOrderController.createPurchaseOrderAndCashTransaction);

router.patch("/purchaseOrder/:id", purchaseOrderController.update);

router.get("/purchaseOrder", protect, purchaseOrderController.getAll);

router.get("/purchaseOrder/:id", purchaseOrderController.getById);

router.delete("/purchaseOrder/:id", purchaseOrderController.remove);


module.exports = router;
