import { Router } from 'express';

const router = Router();

let currentSoilMoisture = 40;
let soilThreshold = 30;
let wateringStatus = 'OFF';

router.get('/status', (req, res) => {
  res.json({ currentSoilMoisture, wateringStatus, soilThreshold });
});

router.post('/set_threshold', (req, res) => {
  const { threshold } = req.body;
  if (threshold !== undefined) {
    soilThreshold = parseInt(threshold, 10);
    res.json({
      message: 'Порог влажности почвы обновлен',
      newThreshold: soilThreshold,
    });
  } else {
    res.status(400).json({ error: 'Укажите threshold' });
  }
});

router.post('/update', (req, res) => {
  const { value } = req.body;
  if (value !== undefined) {
    currentSoilMoisture = parseFloat(value);
    wateringStatus = currentSoilMoisture < soilThreshold ? 'ON' : 'OFF';
    res.json({
      message: 'Значение влажности почвы обновлено',
      currentSoilMoisture,
    });
  } else {
    res.status(400).json({ error: 'Укажите value' });
  }
});

export { router as soilRouter };
