
const mongoose = require('mongoose');

const travelSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  description: { type: String },
  images: { type: [String], default: [] }, 
  cost: { type: Number },  
  heritageSites: { type: [String] }, // Места культурного наследия
  placesToVisit: { type: [String] }, // Места для посещения
  rating: { type: Number }, // Оценка удобства передвижения / безопасности / населенности / растительности
  coordinates: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true } // [долгота, широта]
  }
}, { timestamps: true });

// Создание геоспатиального индекса
travelSchema.index({ coordinates: '2dsphere' });

const Travel = mongoose.model('Travel', travelSchema);
module.exports = Travel;


