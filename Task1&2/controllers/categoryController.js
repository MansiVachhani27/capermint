const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
    const categories = await Category.findAll();
    res.send(categories);
};

exports.createCategory = async (req, res) => {
    const { name, parentId } = req.body;

    let validParentId = parentId;

    if (!parentId || parentId === '') {
        validParentId = null;
    }

    try {
        const category = await Category.create({ name, parentId: validParentId });
        res.status(201).send(category);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};


exports.updateCategory = async (req, res) => {
    const { name, parentId } = req.body;
    const category = await Category.findByPk(req.params.id);

    category.name = name;
    category.parentId = parentId;

    await category.save();
    res.send(category);
};

exports.deleteCategory = async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    await category.destroy();
    res.send({ message: 'Category deleted successfully' });
};