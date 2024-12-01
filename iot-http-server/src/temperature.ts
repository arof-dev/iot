import { Router } from 'express';

const router = Router();

let currentTemperature = 22;
let tempThresholdHigh = 30;
let tempThresholdLow = 15;

let notifyClients: (message: any) => void = () => {};

export function notifyTemperatureClients(callback: (message: any) => void) {
  notifyClients = callback;
}

router.get('/status', (req, res) => {
  res.json({ currentTemperature, tempThresholdHigh, tempThresholdLow });
});

router.post('/set_thresholds', (req, res) => {
  const { high, low } = req.body;
  if (high !== undefined && low !== undefined) {
    tempThresholdHigh = parseInt(high, 10);
    tempThresholdLow = parseInt(low, 10);
    res.json({
      message: 'Пороги температуры обновлены',
      high: tempThresholdHigh,
      low: tempThresholdLow,
    });
  } else {
    res.status(400).json({ error: 'Укажите high и low' });
  }
});

router.post('/update', (req, res) => {
  const { value } = req.body;
  if (value !== undefined) {
    currentTemperature = parseFloat(value);
    if (currentTemperature > tempThresholdHigh) {
      notifyClients({
        type: 'ALERT',
        level: 'HIGH',
        temperature: currentTemperature,
      });
    } else if (currentTemperature < tempThresholdLow) {
      notifyClients({
        type: 'ALERT',
        level: 'LOW',
        temperature: currentTemperature,
      });
    }
    res.json({ message: 'Значение температуры обновлено', currentTemperature });
  } else {
    res.status(400).json({ error: 'Укажите value' });
  }
});

export { router as temperatureRouter };
