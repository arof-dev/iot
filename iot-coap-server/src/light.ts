import { Router } from 'express';
import { IncomingMessage, OutgoingMessage } from 'coap';

let currentLight = 400;
let lightThreshold = 300;
let lampStatus = 'OFF';

export const lightHandler = (req: IncomingMessage, res: OutgoingMessage) => {
  if (req.method === 'GET') {
    res.end(JSON.stringify({ currentLight, lampStatus, lightThreshold }));
  } else if (req.method === 'PUT') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const { value } = JSON.parse(body);
      if (value !== undefined) {
        currentLight = parseFloat(value);
        lampStatus = currentLight < lightThreshold ? 'ON' : 'OFF';
        res.end(
          JSON.stringify({
            message: 'Значение освещенности обновлено',
            currentLight,
            lampStatus,
          })
        );
      } else {
        res.code = '4.00';
        res.end(JSON.stringify({ error: 'Укажите значение освещенности' }));
      }
    });
  } else {
    res.code = '4.05';
    res.end('Method Not Allowed');
  }
};

export const lightREST = Router();

lightREST.get('/status', (req, res) => {
  res.json({ currentLight, lampStatus, lightThreshold });
});

lightREST.post('/set_threshold', (req, res) => {
  const { threshold } = req.body;
  if (threshold !== undefined) {
    lightThreshold = parseFloat(threshold);
    lampStatus = currentLight < lightThreshold ? 'ON' : 'OFF';
    res.json({
      message: 'Порог освещенности обновлен',
      currentLight,
      lampStatus,
    });
  } else {
    res.status(400).json({ error: 'Укажите threshold' });
  }
});
