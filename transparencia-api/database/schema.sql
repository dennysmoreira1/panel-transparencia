-- Script de creación de base de datos para Panel de Transparencia
-- Ejecutar en PostgreSQL

-- Crear base de datos (ejecutar como superusuario)
-- CREATE DATABASE transparencia_db;

-- Conectar a la base de datos
-- \c transparencia_db;

-- Tabla de usuarios (manejada por Sequelize)
-- Esta tabla se crea automáticamente con Sequelize

-- Tabla de sectores
CREATE TABLE IF NOT EXISTS sectores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de obras
CREATE TABLE IF NOT EXISTS obras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'planificada',
    fecha_inicio DATE,
    fecha_fin DATE,
    presupuesto DECIMAL(15,2),
    sector_id INTEGER REFERENCES sectores(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de presupuestos
CREATE TABLE IF NOT EXISTS presupuestos (
    id SERIAL PRIMARY KEY,
    anio INTEGER NOT NULL,
    monto_total DECIMAL(15,2) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de archivos
CREATE TABLE IF NOT EXISTS archivos (
    id SERIAL PRIMARY KEY,
    obra_id INTEGER REFERENCES obras(id) ON DELETE CASCADE,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta VARCHAR(500) NOT NULL,
    tipo_archivo VARCHAR(100),
    tamano INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de contratos
CREATE TABLE IF NOT EXISTS contratos (
    id SERIAL PRIMARY KEY,
    numero_contrato VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    monto DECIMAL(15,2) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    estado VARCHAR(50) DEFAULT 'activo',
    proveedor VARCHAR(200),
    obra_id INTEGER REFERENCES obras(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estadísticas (para cache)
CREATE TABLE IF NOT EXISTS estadisticas_cache (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    datos JSONB NOT NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_obras_sector ON obras(sector_id);
CREATE INDEX IF NOT EXISTS idx_obras_estado ON obras(estado);
CREATE INDEX IF NOT EXISTS idx_archivos_obra ON archivos(obra_id);
CREATE INDEX IF NOT EXISTS idx_contratos_obra ON contratos(obra_id);
CREATE INDEX IF NOT EXISTS idx_presupuestos_anio ON presupuestos(anio);

-- Datos iniciales
INSERT INTO sectores (nombre, descripcion) VALUES
('Educación', 'Obras relacionadas con infraestructura educativa'),
('Salud', 'Obras relacionadas con infraestructura de salud'),
('Infraestructura', 'Obras de infraestructura vial y urbana'),
('Agua y saneamiento', 'Obras de agua potable y alcantarillado'),
('Transporte', 'Obras de transporte público y vialidad')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar presupuestos de ejemplo
INSERT INTO presupuestos (anio, monto_total, descripcion) VALUES
(2020, 320000000, 'Presupuesto anual 2020'),
(2021, 380000000, 'Presupuesto anual 2021'),
(2022, 450000000, 'Presupuesto anual 2022'),
(2023, 520000000, 'Presupuesto anual 2023'),
(2024, 610000000, 'Presupuesto anual 2024')
ON CONFLICT DO NOTHING;

-- Insertar obras de ejemplo
INSERT INTO obras (nombre, descripcion, estado, fecha_inicio, fecha_fin, presupuesto, sector_id) VALUES
('Construcción Escuela Primaria Central', 'Nueva escuela con 12 aulas y laboratorio', 'en_progreso', '2024-01-15', '2024-12-15', 25000000, 1),
('Remodelación Hospital General', 'Ampliación de sala de emergencias', 'planificada', '2024-03-01', '2024-08-30', 18000000, 2),
('Pavimentación Avenida Principal', 'Pavimentación de 2km de avenida', 'completada', '2023-06-01', '2023-11-30', 35000000, 3),
('Sistema de Agua Potable Rural', 'Instalación de red de agua en zona rural', 'en_progreso', '2024-02-01', '2024-10-31', 42000000, 4),
('Terminal de Buses Interurbano', 'Nueva terminal para buses interurbanos', 'planificada', '2024-05-01', '2025-02-28', 55000000, 5)
ON CONFLICT DO NOTHING; 