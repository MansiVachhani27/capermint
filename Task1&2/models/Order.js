const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Order = sequelize.define('Order', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    billingAddress: { type: DataTypes.TEXT, allowNull: false },
    deliveryAddress: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = Order;
