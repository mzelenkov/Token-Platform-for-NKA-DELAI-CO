const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  volume: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;