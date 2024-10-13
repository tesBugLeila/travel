const multer = require('multer');
const path = require('path');

// Настройка Multer для загрузки изображений
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Фильтр для допустимых типов файлов
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Только изображения форматов JPEG, JPG, PNG и GIF разрешены'));
};


const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Максимальный размер файла: 5MB
  fileFilter
});

module.exports = upload;


