const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Usuario = sequelize.define("Usuario", {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM("admin", "editor", "lector"),
        allowNull: false,
        defaultValue: "lector"
    }
}, {
    tableName: "usuarios",
    timestamps: false
});

module.exports = Usuario;
