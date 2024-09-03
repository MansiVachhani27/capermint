const sequelize = require('../config/db');
const Product = require('./Product');
const Category = require('./Category');

// Define associations here
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

module.exports = { Product, Category, sequelize };
