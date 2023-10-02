const express = require("express");
const router = express.Router();
// controller
const categoryController = require("../controllers/categoryController");
// middleware
const protect = require("../middleware/protect");

router.post("/category", categoryController.create);

router.patch("/category/:id", categoryController.update);

router.get("/category", protect, categoryController.getAll);

router.get("/category/:id", categoryController.getById);

router.delete("/category/:id", categoryController.remove);


module.exports = router;
