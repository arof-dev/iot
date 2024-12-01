import { Router } from 'express';

const router = Router();

let currentHumidity = 50;
let humidityThreshold = 50;
let fanStatus = 'OFF';

router.get('/status', (req, res) => {
  res.json({ currentHumidity, fanStatus, humidityThreshold });
});

router.post('/set_threshold', (req, res) => {
  const { threshold } = req.body;
  if (threshold !== undefined) {
    humidityThreshold = parseInt(threshold, 10);
    fanStatus = currentHumidity > humidityThreshold ? 'ON' : 'OFF';
    res.json({
      message: 'Порог влажности обновлен',
      newThreshold: humidityThreshold,
    });
  } else {
    res.status(400).json({ error: 'Укажите threshold' });
  }
});

router.post('/update', (req, res) => {
  const { value } = req.body;
  if (value !== undefined) {
    currentHumidity = parseFloat(value);
    fanStatus = currentHumidity > humidityThreshold ? 'ON' : 'OFF';
    res.json({ message: 'Значение влажности обновлено', currentHumidity });
  } else {
    res.status(400).json({ error: 'Укажите value' });
  }
});

export { router as humidityRouter };
