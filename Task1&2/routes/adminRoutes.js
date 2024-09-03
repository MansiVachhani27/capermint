const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAuthenticated = (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }
    next();
};

router.get('/login', (req, res) => res.render('login'));
router.post('/login', adminController.adminLogin);
router.get('/dashboard', isAuthenticated, adminController.dashboard);
router.get('/categories', isAuthenticated, adminController.getCategories);
router.get('/products', isAuthenticated, adminController.getProducts);
router.get('/orders', isAuthenticated, adminController.getOrders);
router.get('/orders/:id', isAuthenticated, adminController.viewOrderDetails);
router.post('/orders/:id', isAuthenticated, adminController.updateOrderStatus);
router.get('/logout', adminController.logout);

module.exports = router;
