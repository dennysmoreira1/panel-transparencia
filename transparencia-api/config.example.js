// config.example.js - Copiar a config.js y configurar con tus valores
module.exports = {
    // Configuración del servidor
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Base de datos PostgreSQL
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_NAME: process.env.DB_NAME || 'transparencia_db',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/transparencia_db',

    // JWT Secrets
    JWT_SECRET: process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro_aqui_2024',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'tu_jwt_refresh_secret_super_seguro_aqui_2024',

    // Configuración de archivos
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10485760,

    // Configuración de seguridad
    BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 10,
}; 