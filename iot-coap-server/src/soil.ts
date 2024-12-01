import { Router } from 'express';
import { IncomingMessage, OutgoingMessage } from 'coap';

let currentSoilMoisture = 40;
let soilThreshold = 30;
let wateringStatus = 'OFF';

export const soilHandler = (req: IncomingMessage, res: OutgoingMessage) => {
  if (req.method === 'GET') {
    res.end(
      JSON.stringify({ currentSoilMoisture, wateringStatus, soilThreshold })
    );
  } else if (req.method === 'PUT') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const { value } = JSON.parse(body);
      if (value !== undefined) {
        currentSoilMoisture = parseFloat(value);
        wateringStatus = currentSoilMoisture < soilThreshold ? 'ON' : 'OFF';
        res.end(
          JSON.stringify({
            message: 'Значение влажности почвы обновлено',
            currentSoilMoisture,
            wateringStatus,
          })
        );
      } else {
        res.code = '4.00';
        res.end(JSON.stringify({ error: 'Укажите значение влажности почвы' }));
      }
    });
  } else {
    res.code = '4.05';
    res.end('Method Not Allowed');
  }
};

export const soilREST = Router();

soilREST.get('/status', (req, res) => {
  res.json({ currentSoilMoisture, wateringStatus, soilThreshold });
});

soilREST.post('/set_threshold', (req, res) => {
  const { threshold } = req.body;
  if (threshold !== undefined) {
    soilThreshold = parseFloat(threshold);
    wateringStatus = currentSoilMoisture < soilThreshold ? 'ON' : 'OFF';
    res.json({
      message: 'Порог влажности почвы обновлен',
      currentSoilMoisture,
      wateringStatus,
    });
  } else {
    res.status(400).json({ error: 'Укажите threshold' });
  }
});
