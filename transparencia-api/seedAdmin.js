const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/db');
const Usuario = require('./models/Usuario');

const crearUsuarioAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión establecida con la base de datos');

        await sequelize.sync(); // asegura que la tabla exista

        const email = 'admin@admin.com';
        const existe = await Usuario.findOne({ where: { email } });

        if (existe) {
            console.log('ℹ️ El usuario admin ya existe');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const nuevoUsuario = await Usuario.create({
            username: 'Administrador',
            email,
            password: hashedPassword,
            rol: 'admin'
        });

        console.log('✅ Usuario admin creado exitosamente:');
        console.log('   Email: admin@admin.com');
        console.log('   Password: admin123');
        console.log('   Rol: admin');
    } catch (error) {
        console.error('❌ Error al crear usuario admin:', error.message);
    } finally {
        process.exit(0);
    }
};

crearUsuarioAdmin();
