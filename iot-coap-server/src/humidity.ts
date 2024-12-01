import { Router } from 'express';
import { IncomingMessage, OutgoingMessage } from 'coap';

let currentHumidity = 50;
let humidityThreshold = 50;
let fanStatus = 'OFF';

export const humidityHandler = (req: IncomingMessage, res: OutgoingMessage) => {
  if (req.method === 'GET') {
    res.end(JSON.stringify({ currentHumidity, fanStatus, humidityThreshold }));
  } else if (req.method === 'PUT') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const { value } = JSON.parse(body);
      if (value !== undefined) {
        currentHumidity = parseFloat(value);
        fanStatus = currentHumidity > humidityThreshold ? 'ON' : 'OFF';
        res.end(
          JSON.stringify({
            message: 'Значение влажности обновлено',
            currentHumidity,
            fanStatus,
          })
        );
      } else {
        res.code = '4.00';
        res.end(JSON.stringify({ error: 'Укажите значение влажности' }));
      }
    });
  } else {
    res.code = '4.05';
    res.end('Method Not Allowed');
  }
};

export const humidityREST = Router();

humidityREST.get('/status', (req, res) => {
  res.json({ currentHumidity, fanStatus, humidityThreshold });
});

humidityREST.post('/set_threshold', (req, res) => {
  const { threshold } = req.body;
  if (threshold !== undefined) {
    humidityThreshold = parseFloat(threshold);
    fanStatus = currentHumidity > humidityThreshold ? 'ON' : 'OFF';
    res.json({
      message: 'Порог влажности обновлен',
      currentHumidity,
      fanStatus,
    });
  } else {
    res.status(400).json({ error: 'Укажите threshold' });
  }
});
