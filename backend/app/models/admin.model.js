const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Admin = sequelize.define('admin', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            max: 50,
            allowNull: false,
            unique: 'username',
        },
        password: {
            type: DataTypes.STRING,
            max: 150,
            allowNull: false
        },
    },
    );

    return Admin;
};