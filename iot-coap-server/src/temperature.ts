import { Router } from 'express';
import { notifyTemperatureClients } from './app';
import { IncomingMessage, OutgoingMessage } from 'coap';

let currentTemperature = 22;
let tempThresholdHigh = 30;
let tempThresholdLow = 15;

export const temperatureHandler = (
  req: IncomingMessage,
  res: OutgoingMessage
) => {
  if (req.method === 'GET') {
    res.end(
      JSON.stringify({
        currentTemperature,
        tempThresholdHigh,
        tempThresholdLow,
      })
    );
  } else if (req.method === 'PUT') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const { value } = JSON.parse(body);
      if (value !== undefined) {
        currentTemperature = parseFloat(value);

        let message = {
          type: 'INFO',
          level: 'NORMAL',
          temperature: currentTemperature,
        };

        if (currentTemperature > tempThresholdHigh) {
          message = {
            type: 'ALERT',
            level: 'HIGH',
            temperature: currentTemperature,
          };
        } else if (currentTemperature < tempThresholdLow) {
          message = {
            type: 'ALERT',
            level: 'LOW',
            temperature: currentTemperature,
          };
        }

        notifyTemperatureClients(message);

        res.end(
          JSON.stringify({
            message: 'Температура обновлена',
            currentTemperature,
          })
        );
      } else {
        res.code = '4.00';
        res.end(JSON.stringify({ error: 'Укажите значение температуры' }));
      }
    });
  } else {
    res.code = '4.05';
    res.end('Method Not Allowed');
  }
};

export const temperatureREST = Router();

temperatureREST.get('/status', (req, res) => {
  res.json({ currentTemperature, tempThresholdHigh, tempThresholdLow });
});

temperatureREST.post('/set_thresholds', (req, res) => {
  const { high, low } = req.body;
  if (high !== undefined && low !== undefined) {
    tempThresholdHigh = parseFloat(high);
    tempThresholdLow = parseFloat(low);
    res.json({
      message: 'Пороги температуры обновлены',
      tempThresholdHigh,
      tempThresholdLow,
    });
  } else {
    res.status(400).json({ error: 'Укажите high и low' });
  }
});
