const express = require("express");
const router = express.Router();
// controller
const userController = require("../controllers/userController");
// middleware
const protect = require("../middleware/protect");


router.post("/user/signup", userController.signup);

router.post("/user/login", userController.login);

router.patch("/user/:id", userController.update);

router.get("/user/:id", userController.getById);

router.get("/user", userController.getAll);

router.delete("/user/:id", userController.remove);

module.exports = router;
