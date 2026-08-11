require('dotenv').config();
const express = require('express');
const SensorLog = require('../models/SensorLog');
const router = express.Router();

/**
 * POST /sensor
 * Endpoint for ESP32 (or clients) to post real-time sensor measurements.
 * Body: { mq2: Number, mq5: Number, mq7: Number, deviceId?: String }
 * Header: Authorization: Bearer <JWT_TOKEN>
 */
router.post('/', async (req, res) => {
  try {
    const { mq2, mq5, mq7, deviceId } = req.body;

    // Basic payload validation
    if (mq2 === undefined || mq5 === undefined || mq7 === undefined) {
      return res.status(400).json({ error: 'Missing required sensor fields: mq2, mq5, mq7' });
    }

    const log = new SensorLog({
      mq2: Number(mq2),
      mq5: Number(mq5),
      mq7: Number(mq7),
      deviceId: deviceId || 'ESP32_DEFAULT'
    });

    await log.save();
    res.status(201).json({ status: 'ok', log });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /sensor/latest
 * Fetches the most recent sensor reading.
 */
router.get('/latest', async (req, res) => {
  try {
    const latestLog = await SensorLog.findOne().sort({ timestamp: -1 });
    if (!latestLog) {
      return res.status(404).json({ message: 'No sensor data recorded yet' });
    }
    res.json(latestLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /sensor/history
 * Fetches historical sensor readings (sorted newest to oldest).
 * Optional query param: ?limit=50
 */
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const maxLimit = Math.min(limit, 500); // cap max results to 500

    const logs = await SensorLog.find()
      .sort({ timestamp: -1 })
      .limit(maxLimit);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /sensor/
 * Backward compatible endpoint to fetch sensor logs.
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const logs = await SensorLog.find().sort({ timestamp: -1 }).limit(limit);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
