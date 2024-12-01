import { Router } from 'express';
import mqtt from 'mqtt';

const router = Router();
const MQTT_BROKER = 'mqtt://localhost:1883';
const TOPIC_SENSOR = 'temperature/sensor';
const TOPIC_ALERT = 'temperature/alert';

let currentTemperature: number | null = null;
let tempThresholdHigh = 30;
let tempThresholdLow = 15;
let lastNotification: string | null = null;

const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  mqttClient.subscribe(TOPIC_SENSOR);
});

mqttClient.on('message', (topic, message) => {
  if (topic === TOPIC_SENSOR) {
    currentTemperature = parseFloat(message.toString());
    if (currentTemperature > tempThresholdHigh && lastNotification !== 'HIGH') {
      mqttClient.publish(TOPIC_ALERT, 'HIGH');
      lastNotification = 'HIGH';
    } else if (
      currentTemperature < tempThresholdLow &&
      lastNotification !== 'LOW'
    ) {
      mqttClient.publish(TOPIC_ALERT, 'LOW');
      lastNotification = 'LOW';
    } else if (
      tempThresholdLow <= currentTemperature &&
      currentTemperature <= tempThresholdHigh
    ) {
      lastNotification = null;
    }
  }
});

router.get('/status', (req, res) => {
  res.json({ currentTemperature, tempThresholdHigh, tempThresholdLow });
});

router.post('/set_thresholds', (req, res) => {
  const { high, low } = req.body;
  if (high !== undefined && low !== undefined) {
    tempThresholdHigh = parseFloat(high);
    tempThresholdLow = parseFloat(low);
    res.json({
      message: 'Пороги температуры обновлены',
      high: tempThresholdHigh,
      low: tempThresholdLow,
    });
  } else {
    res.status(400).json({ error: 'Укажите high и low' });
  }
});

export { router as temperatureRouter };
