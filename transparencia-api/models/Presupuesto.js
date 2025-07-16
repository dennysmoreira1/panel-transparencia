// models/Presupuesto.js
const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Presupuesto = db.define('Presupuesto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    monto: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    año: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Presupuesto;
