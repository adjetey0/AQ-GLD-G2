const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  mq2: { type: Number, required: true },
  mq5: { type: Number, required: true },
  mq7: { type: Number, required: true },
  deviceId: { type: String, default: 'ESP32_DEFAULT' },
  timestamp: { type: Date, default: Date.now }
});

// Index timestamp for fast sorting of /latest and /history queries
sensorSchema.index({ timestamp: -1 });

module.exports = mongoose.model('SensorLog', sensorSchema);
