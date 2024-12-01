import { Router } from 'express';

const router = Router();

let currentLight = 400;
let lightThreshold = 300;
let lampStatus = 'OFF';

router.get('/status', (req, res) => {
  res.json({ currentLight, lampStatus, lightThreshold });
});

router.post('/set_threshold', (req, res) => {
  const { threshold } = req.body;
  if (threshold !== undefined) {
    lightThreshold = parseInt(threshold, 10);
    lampStatus = currentLight < lightThreshold ? 'ON' : 'OFF';
    res.json({
      message: 'Порог освещенности обновлен',
      newThreshold: lightThreshold,
    });
  } else {
    res.status(400).json({ error: 'Укажите threshold' });
  }
});

router.post('/update', (req, res) => {
  const { value } = req.body;
  if (value !== undefined) {
    currentLight = parseFloat(value);
    lampStatus = currentLight < lightThreshold ? 'ON' : 'OFF';
    res.json({ message: 'Значение освещенности обновлено', currentLight });
  } else {
    res.status(400).json({ error: 'Укажите value' });
  }
});

export { router as lightRouter };
