const Travel = require('../models/Travel');

// Создание записи о путешествии
exports.createTravel = async (req, res) => {
  const { location, description, cost, heritageSites, placesToVisit, rating, latitude, longitude } = req.body;
  try {
   
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newTravel = new Travel({
      user: req.user.id,
      location,
      description,
      images: imagePaths, 
      cost,
      heritageSites: heritageSites ? heritageSites.split(',').map(site => site.trim()) : [],
      placesToVisit: placesToVisit ? placesToVisit.split(',').map(place => place.trim()) : [],
      rating,
      coordinates: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)] 
      }
    });
    await newTravel.save();
    res.status(201).json(newTravel);
  } catch (err) {
    console.error('Ошибка при создании путешествия:', err);
    res.status(500).json({ message: 'Ошибка сервера: ' + err.message });
  }
};

// Получение всех путешествий
exports.getAllTravels = async (req, res) => {
  try {
    const travels = await Travel.find().populate('user', 'username');
    res.json(travels);
  } catch (err) {
    console.error('Ошибка при получении всех путешествий:', err);
    res.status(500).json({ message: 'Ошибка сервера: ' + err.message });
  }
};

// Получение путешествий текущего пользователя
exports.getMyTravels = async (req, res) => {
  try {
    const travels = await Travel.find({ user: req.user.id }).populate('user', 'username');
    res.json(travels);
  } catch (err) {
    console.error('Ошибка при получении моих путешествий:', err);
    res.status(500).json({ message: 'Ошибка сервера: ' + err.message });
  }
};

// Получение путешествий по геопозиции
exports.getTravelsByLocation = async (req, res) => {
  let { latitude, longitude, distance } = req.query; 

  if (!latitude || !longitude || !distance) {
    return res.status(400).json({ message: 'Необходимы latitude, longitude и distance для фильтрации' });
  }


  latitude = parseFloat(latitude);
  longitude = parseFloat(longitude);
  distance = parseFloat(distance);

  if (isNaN(latitude) || isNaN(longitude) || isNaN(distance)) {
    return res.status(400).json({ message: 'Параметры latitude, longitude и distance должны быть числами' });
  }

  try {
    const radius = distance / 6378.1; // Радиус Земли ≈ 6378.1 км

    const travels = await Travel.find({
      coordinates: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius]
        }
      }
    }).populate('user', 'username');

    res.json(travels);
  } catch (err) {
    console.error('Ошибка при поиске путешествий по геопозиции:', err);
    res.status(500).json({ message: 'Ошибка сервера: ' + err.message });
  }
};

// Получение информации о конкретном путешествии по ID
exports.getTravelById = async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id).populate('user', 'username');
    if (!travel) {
      return res.status(404).json({ message: 'Путешествие не найдено' });
    }
    res.json(travel);
  } catch (err) {
    console.error('Ошибка при получении деталей путешествия:', err);
    res.status(500).json({ message: 'Ошибка сервера: ' + err.message });
  }
};


