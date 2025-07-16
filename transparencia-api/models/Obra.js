const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Obra = sequelize.define("Obra", {
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    sector: { type: DataTypes.STRING, allowNull: false },
    estado: {
        type: DataTypes.ENUM("En ejecucion", "Finalizada", "Suspendida"),
        defaultValue: "En ejecucion",
    },
    fecha_inicio: { type: DataTypes.DATEONLY },
    fecha_fin: { type: DataTypes.DATEONLY },
    presupuesto: { type: DataTypes.DECIMAL(12, 2) },
}, {
    tableName: "obras",
    timestamps: false,
});

module.exports = Obra;