const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const { requireAuth } = require('./middlewares/authMiddleware');

// Rutas de autenticación
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getProfile);
router.post('/refresh', authController.refreshToken);

module.exports = router;
