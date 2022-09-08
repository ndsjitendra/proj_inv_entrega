const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Compresor = sequelize.define('compresor', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        modelo: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        tipo: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        aplicacion: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        hp: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        refrigerante: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        conexion: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        voltaje: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        fases: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        btu: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        desc_prod: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        minimoPresionEvaporacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maximoPresionEvaporacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minimoTemperaturaEvaporacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maximoTemperaturaEvaporacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minimoPresionCondensacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maximoPresionCondensacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maximoTemperaturaCondensacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minimoTemperaturaCondensacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minimoTemperaturaFinal: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maximoTemperaturaFinal: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    );

    return Compresor;
};