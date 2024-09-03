const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');  // Import the Product model

const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false },
    parentId: { type: DataTypes.INTEGER, defaultValue: null },
});

// Define associations
// Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

module.exports = Category;
