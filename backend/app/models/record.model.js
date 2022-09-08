const { Sequelize, DataTypes, INTEGER } = require('sequelize');

module.exports = (sequelize) => {
    const Record = sequelize.define('record', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        localId: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        modelo: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        serie: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        fechaCompra: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        distribuidor: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        factura: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
        nombreCliente: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        correoCliente: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        telefonoCliente: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        estadoCliente: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        telefonoCliente: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        modeloCompresorReemplazarCliente: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        modeloCompresorCliente: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        vendedor: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        sucursal: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        maquinaCliente: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        checklistComplete: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        tipoGarantia: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        garantia: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        fileLocation: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        presionEvaporacion: {
            type: INTEGER,
            allowNull: false
        },
        temperaturaEvaporacion: {
            type: INTEGER,
            allowNull: false
        },
        presionCondensacion: {
            type: INTEGER,
            allowNull: false
        },
        temperaturaCondensacion: {
            type: INTEGER,
            allowNull: false
        },
        temperaturaFinal: {
            type: INTEGER,
            allowNull: false
        },
        contactorCapacitor: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
        superiorCapacitor: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
        compresorSoldado: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
        instalacion: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
    },
    );

    return Record;
};