import express from 'express';
import cors from 'cors';
import { Server as WebSocketServer } from 'ws';
import { humidityRouter } from './humidity';
import { lightRouter } from './light';
import { soilRouter } from './soil';
import { temperatureRouter, notifyTemperatureClients } from './temperature';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/humidity', humidityRouter);
app.use('/api/light', lightRouter);
app.use('/api/soil', soilRouter);
app.use('/api/temperature', temperatureRouter);

const server = app.listen(3001, () => {
  console.log('HTTP сервер запущен на http://localhost:3001');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket клиент подключен');
  ws.on('close', () => {
    console.log('WebSocket клиент отключен');
  });
});

// Передача уведомлений в модуль температуры
notifyTemperatureClients((message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
});
