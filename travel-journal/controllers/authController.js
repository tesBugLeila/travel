const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Регистрация пользователя
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
  
    const userExistsByEmail = await User.findOne({ email });
    if (userExistsByEmail) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const userExistsByUsername = await User.findOne({ username });
    if (userExistsByUsername) {
      return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: { id: newUser._id, username: newUser.username }
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера: ' + err.message });
  }
};



// Вход пользователя
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера: ' + err.message });
  }
};

// Получение данных текущего пользователя
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера: ' + err.message });
  }
};
