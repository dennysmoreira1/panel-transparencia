// config/db.js
require("dotenv").config();
const { Sequelize } = require("sequelize");
const { Pool } = require("pg");

console.log("🔍 === INICIO DEBUG CONFIGURACIÓN BD ===");
console.log("DATABASE_URL disponible:", !!process.env.DATABASE_URL);
console.log("DB_HOST disponible:", !!process.env.DB_HOST);

let sequelize;
let pool;

// Intentar usar DATABASE_URL primero
if (process.env.DATABASE_URL) {
    console.log("🔄 Configurando con DATABASE_URL...");

    try {
        sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: "postgres",
            logging: false,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        });

        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        });

        console.log("✅ Conexión configurada con DATABASE_URL");
    } catch (error) {
        console.error("❌ Error con DATABASE_URL:", error.message);
    }
} else {
    console.log("🔄 DATABASE_URL no disponible, usando variables locales...");

    try {
        sequelize = new Sequelize(
            process.env.DB_NAME || "transparencia_db",
            process.env.DB_USER || "postgres",
            process.env.DB_PASSWORD || "",
            {
                host: process.env.DB_HOST || "localhost",
                port: process.env.DB_PORT || 5432,
                dialect: "postgres",
                logging: false,
            }
        );

        pool = new Pool({
            host: process.env.DB_HOST || "localhost",
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || "transparencia_db",
            user: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "",
        });

        console.log("✅ Conexión configurada con variables locales");
    } catch (error) {
        console.error("❌ Error con variables locales:", error.message);
    }
}

console.log("🔍 === FIN DEBUG CONFIGURACIÓN BD ===");

module.exports = { sequelize, pool };
