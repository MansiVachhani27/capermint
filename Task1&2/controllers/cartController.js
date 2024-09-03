const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
    const { productId, qty } = req.body;
    const product = await Product.findByPk(productId);

    if (!product) return res.status(404).send('Product not found');
    if (product.qty < qty) return res.status(400).send(`Only ${product.qty} qty available for this product`);

    let cartItem = await Cart.findOne({ where: { userId: req.user.id, productId } });

    if (cartItem) {
        cartItem.qty += qty;
        if (cartItem.qty > product.qty) {
            return res.status(400).send(`Only ${product.qty} qty available for this product`);
        }
        await cartItem.save();
    } else {
        cartItem = await Cart.create({ userId: req.user.id, productId, qty });
    }

    res.send(cartItem);
};

exports.updateCart = async (req, res) => {
    const { qty } = req.body;
    const cartItem = await Cart.findByPk(req.params.id);

    if (!cartItem) return res.status(404).send('Cart item not found');
    const product = await Product.findByPk(cartItem.productId);

    if (product.qty < qty) return res.status(400).send(`Only ${product.qty} qty available for this product`);

    cartItem.qty = qty;
    await cartItem.save();
    res.send(cartItem);
};

exports.removeFromCart = async (req, res) => {
    const cartItem = await Cart.findByPk(req.params.id);
    if (!cartItem) return res.status(404).send('Cart item not found');
    await cartItem.destroy();
    res.send({ message: 'Item removed from cart' });
};

exports.getCart = async (req, res) => {
    const cartItems = await Cart.findAll({ where: { userId: req.user.id }, include: [Product] });
    res.send(cartItems);
};
