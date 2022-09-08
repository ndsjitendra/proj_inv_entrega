const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Distributor = sequelize.define('distributor', {
        distribuidor: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        sucursal: {
            type: DataTypes.STRING(150),
            allowNull: false 
        }
    },
    );

    return Distributor;
};