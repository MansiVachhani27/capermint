const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./Category');  // Import the Category model

const Product = sequelize.define('Product', {
    title: { type: DataTypes.STRING, allowNull: false },
    qty: { type: DataTypes.INTEGER, allowNull: false },
    color: { type: DataTypes.STRING },
    size: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    imageUrl: { type: DataTypes.STRING },
    categoryId: { type: DataTypes.INTEGER, allowNull: true }
});

// Define associations
// Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = Product;