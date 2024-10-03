const mongoose = require('mongoose');

const holeSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  par: { type: Number, required: true },
  distance: { type: Number, required: true },
  handicap: { type: Number, required: true }
});

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  holes: [holeSchema],
  totalPar: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Course', courseSchema);