const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
// const { getOrder, postOrder } = require("../controllers/order");
// router.get("/order", getOrder);

router.post("/order", orderController.postOrder);

router.get("/order", orderController.getOrder);

module.exports = router;
