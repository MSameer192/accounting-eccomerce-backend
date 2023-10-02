const express = require("express");
const router = express.Router();
// controller
const productController = require("../controllers/productController");
// middleware
const protect = require("../middleware/protect");

router.post("/product", productController.create);

router.patch("/product/:id", productController.update);

router.get("/product", protect, productController.getAll);

router.get("/product/:id", productController.getById);

router.delete("/product/:id", productController.remove);


module.exports = router;
