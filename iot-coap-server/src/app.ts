import express from 'express';
import cors from 'cors';
import { createServer } from 'coap';
import { humidityHandler, humidityREST } from './humidity';
import { lightHandler, lightREST } from './light';
import { soilHandler, soilREST } from './soil';
import { temperatureHandler, temperatureREST } from './temperature';
import { Server as WebSocketServer } from 'ws';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/humidity', humidityREST);
app.use('/api/light', lightREST);
app.use('/api/soil', soilREST);
app.use('/api/temperature', temperatureREST);

const server = app.listen(3001, () => {
  console.log('HTTP сервер запущен на http://localhost:3001');
});

const coapServer = createServer((req, res) => {
  switch (req.url) {
    case '/humidity':
      humidityHandler(req, res);
      break;
    case '/light':
      lightHandler(req, res);
      break;
    case '/soil':
      soilHandler(req, res);
      break;
    case '/temperature':
      temperatureHandler(req, res);
      break;
    default:
      res.code = '4.04';
      res.end('Not Found');
  }
});

coapServer.listen(() => {
  console.log('CoAP сервер запущен на порту 5683');
});

const wsServer = new WebSocketServer({ server });

wsServer.on('connection', (ws) => {
  console.log('WebSocket клиент подключен');

  ws.on('close', () => {
    console.log('WebSocket клиент отключен');
  });
});

const notifyTemperatureClients = (message: any) => {
  wsServer.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
};

export { notifyTemperatureClients };
