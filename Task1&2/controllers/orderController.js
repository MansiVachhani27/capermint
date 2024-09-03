const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
    const { billingAddress, deliveryAddress } = req.body;
    const cartItems = await Cart.findAll({ where: { userId: req.user.id } });

    if (cartItems.length === 0) return res.status(400).send('Cart is empty');

    const order = await Order.create({
        userId: req.user.id,
        billingAddress,
        deliveryAddress
    });

    // Reduce product qty
    for (let item of cartItems) {
        const product = await Product.findByPk(item.productId);
        product.qty -= item.qty;
        await product.save();
    }

    await Cart.destroy({ where: { userId: req.user.id } }); // Clear cart

    res.send(order);
};

exports.getOrders = async (req, res) => {
    const orders = await Order.findAll({ where: { userId: req.user.id } });
    res.send(orders);
};

exports.getOrderDetails = async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    res.send(order);
};

exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    order.status = status;
    await order.save();
    res.send(order);
};
