const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const expressSession = require('express-session');

exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    const admin = await User.findOne({ where: { email: username, role: 'admin' } });

    if (!admin) return res.status(400).render('login', { error: 'Invalid credentials' });

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) return res.status(400).render('login', { error: 'Invalid credentials' });

    req.session.admin = admin;
    res.redirect('/admin/dashboard');
};

exports.dashboard = async (req, res) => {
    res.render('dashboard');
};

exports.getCategories = async (req, res) => {
    const categories = await Category.findAll();
    res.render('categories', { categories });
};

exports.getProducts = async (req, res) => {
    const products = await Product.findAll();
    res.render('products', { products });
};

exports.getOrders = async (req, res) => {
    const orders = await Order.findAll();
    res.render('orders', { orders });
};

exports.viewOrderDetails = async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    res.render('order-details', { order });
};

exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    order.status = status;
    await order.save();
    res.redirect('/admin/orders');
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
};