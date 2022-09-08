const { Sequelize, DataTypes, INTEGER } = require('sequelize');

module.exports = (sequelize) => {
    const Payment = sequelize.define('payment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        idUsername: {
            type: DataTypes.STRING,
            allowNull: false
        },
        localRecordId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        balance: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    );

    return Payment;
};