
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); 

// Маршрут для регистрации
router.post('/register', authController.register);

// Маршрут для входа
router.post('/login', authController.login);

// Маршрут для получения данных текущего пользователя
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
