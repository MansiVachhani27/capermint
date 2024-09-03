const { Op } = require('sequelize');
const Product = require('../models/Product');
const Category = require('../models/Category');
exports.getProductsPage = async (req, res) => {
    try {
        const categories = await Category.findAll();
        const products = await Product.findAll();
        res.render('products', { categories, products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
exports.getProducts = async (req, res) => {
    let { minPrice, maxPrice, category, search, sort } = req.query;

    const options = {
        where: {},
        // include: [{ model: Category, as: 'category' }]  // Use the defined alias
    };

    if (minPrice) options.where.amount = { [Op.gte]: minPrice };
    if (maxPrice) options.where.amount = { [Op.lte]: maxPrice };
    if (category) options.where.categoryId = category;
    if (search) options.where.title = { [Op.like]: `%${search}%` };
    if (sort) options.order = [['amount', sort === 'asc' ? 'ASC' : 'DESC']];
    // if (sort) options.order = [['title', sort === 'asc' ? 'ASC' : 'DESC']];
    // if (sort) options.order = [['createdAt', sort === 'asc' ? 'ASC' : 'DESC']];

    try {
        const products = await Product.findAll(options);
        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.createProduct = async (req, res) => {
    const { title, qty, color, size, description, amount, categoryId, imageUrl } = req.body;

    try {
        const product = await Product.create({ title, qty, color, size, description, amount, categoryId, imageUrl });
        res.status(201).send(product);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.updateProduct = async (req, res) => {
    const { title, qty, color, size, description, amount, categoryId, imageUrl } = req.body;

    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).send('Product not found');

        product.title = title || product.title;
        product.qty = qty || product.qty;
        product.color = color || product.color;
        product.size = size || product.size;
        product.description = description || product.description;
        product.amount = amount || product.amount;
        product.categoryId = categoryId || product.categoryId;
        product.imageUrl = imageUrl || product.imageUrl;

        await product.save();
        res.send(product);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        
        await product.destroy();
        res.send({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};