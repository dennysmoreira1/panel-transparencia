const Presupuesto = require('../models/Presupuesto');

exports.obtenerPresupuestos = async (req, res) => {
    try {
        const presupuestos = await Presupuesto.findAll();
        res.json(presupuestos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener presupuestos' });
    }
};

exports.crearPresupuesto = async (req, res) => {
    try {
        const nuevo = await Presupuesto.create(req.body);
        res.json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear presupuesto' });
    }
};

exports.actualizarPresupuesto = async (req, res) => {
    try {
        const { id } = req.params;
        await Presupuesto.update(req.body, { where: { id } });
        res.json({ mensaje: 'Presupuesto actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar presupuesto' });
    }
};

exports.eliminarPresupuesto = async (req, res) => {
    try {
        const { id } = req.params;
        await Presupuesto.destroy({ where: { id } });
        res.json({ mensaje: 'Presupuesto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar presupuesto' });
    }
};
