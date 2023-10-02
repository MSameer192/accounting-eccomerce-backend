const express = require("express");
const router = express.Router();
// controller
const supplierController = require("../../controllers/Accounting/supplierController");
// middleware
const protect = require("../../middleware/protect");

router.post("/supplier", supplierController.create);

router.patch("/supplier/:id", supplierController.update);

router.get("/supplier", protect, supplierController.getAll);

router.get("/supplier/:id", supplierController.getById);

router.delete("/supplier/:id", supplierController.remove);

module.exports = router;
