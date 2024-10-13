const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); 
const travelController = require('../controllers/travelController');
const authMiddleware = require('../middleware/authMiddleware');

// маршрут для получения путешествий текущего пользователя
router.get('/mine', authMiddleware, travelController.getMyTravels);

// Маршрут для создания записи о путешествии (требует авторизации)
router.post('/', authMiddleware, upload.array('images', 10), travelController.createTravel); // Максимум 10 изображений

// Маршрут для получения всех записей о путешествиях
router.get('/', travelController.getAllTravels);

// Получение записей о путешествиях по геопозиции
router.get('/by-location', travelController.getTravelsByLocation);

// Маршрут для получения информации о конкретном путешествии по ID
router.get('/:id', travelController.getTravelById);

module.exports = router;


