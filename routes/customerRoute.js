const express = require("express");
const router = express.Router();
// controller
const customerController = require("../controllers/customerController");
// middleware
const protect = require("../middleware/protect");

router.post("/customer", customerController.create);

router.patch("/customer/:id", customerController.update);

router.get("/customer", protect, customerController.getAll);

router.get("/customer/:id", customerController.getById);

router.delete("/customer/:id", customerController.remove);


module.exports = router;
