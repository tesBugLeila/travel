
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer'); 

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Подключено к MongoDB'))
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err));


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


const authRoutes = require('./routes/auth');
const travelRoutes = require('./routes/travel');

app.use('/auth', authRoutes);
app.use('/travel', travelRoutes);


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
 
    return res.status(400).json({ message: err.message });
  } else if (err) {
    
    return res.status(400).json({ message: err.message });
  }
  next();
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});


