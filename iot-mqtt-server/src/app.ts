import express from 'express';
import cors from 'cors';
import { humidityRouter } from './humidity';
import { lightRouter } from './light';
import { soilRouter } from './soil';
import { temperatureRouter } from './temperature';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/humidity', humidityRouter);
app.use('/api/light', lightRouter);
app.use('/api/soil', soilRouter);
app.use('/api/temperature', temperatureRouter);

app.listen(3001, () => {
  console.log('Сервер запущен на http://localhost:3001');
});
