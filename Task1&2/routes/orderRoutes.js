const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');

router.get('/', auth, orderController.getOrders);
router.post('/', auth, orderController.placeOrder);
router.get('/:id', auth, orderController.getOrderDetails);

module.exports = router;
