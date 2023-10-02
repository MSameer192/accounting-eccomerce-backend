const express = require("express");
const router = express.Router();
// controller
const saleOrderController = require("../../controllers/Inventory/saleOrderController");
// middleware
const protect = require("../../middleware/protect");

router.post("/saleOrder", saleOrderController.createSaleOrderAndCashTransaction);

router.patch("/saleOrder/:id", saleOrderController.update);

router.get("/saleOrder", protect, saleOrderController.getAll);

router.get("/saleOrder/:id", saleOrderController.getById);

router.delete("/saleOrder/:id", saleOrderController.remove);


module.exports = router;
