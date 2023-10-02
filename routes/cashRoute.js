const express = require("express");
const router = express.Router();
// controller
const cashController = require("../controllers/cashController");
// middleware
const protect = require("../middleware/protect");

router.post("/cash", cashController.create);

router.patch("/cash/:id", cashController.update);

router.get("/cash", protect, cashController.getAll);

router.get("/cash/:id", cashController.getById);

router.delete("/cash/:id", cashController.remove);


module.exports = router;
