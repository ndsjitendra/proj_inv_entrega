const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        localId: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        telefono: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            max: 255,
            allowNull: false
        },
        ciudad: {
            type: DataTypes.STRING,
            max: 255,
            allowNull: false
        },
        cp: {
            type: DataTypes.STRING(10),
            max: 100,
            allowNull: false
        },
        persona: {
            type: DataTypes.STRING(20),
            max: 100,
            allowNull: false
        },
        banco: {
            type: DataTypes.STRING(50),
            max: 100,
            allowNull: false
        },
        tarjeta: {
            type: DataTypes.STRING(16),
            max: 16,
            allowNull: false
        },
        clabe: {
            type: DataTypes.STRING(18),
            max: 18,
            allowNull: true
        },
        rfc: {
            type: DataTypes.STRING(15),
            max: 13,
            allowNull: false
        },
        calleYnum: {
            type: DataTypes.STRING,
            max: 255,
            allowNull: false
        },
        actividad: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        experiencia: {
            type: DataTypes.STRING(100),
            max: 2,
            allowNull: false
        },
        utilizadoCompresor: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        recibirInformacion: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        foto: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
        tipoDeCuenta: {
            type: DataTypes.INTEGER({
                length: 2
            }),
            allowNull: false
        },
        matricula: {
            type: DataTypes.STRING(8),
            allowNull: false,
            unique: 'matricula',
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
        terminosPrivacidad: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        userSync: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
    },
    );

    return User;
};