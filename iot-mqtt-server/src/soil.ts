import { Router } from 'express';
import mqtt from 'mqtt';

const router = Router();
const MQTT_BROKER = 'mqtt://localhost:1883';
const TOPIC_SENSOR = 'soil/sensor';
const TOPIC_WATER = 'soil/water';

let currentSoilMoisture: number | null = null;
let soilThreshold = 30;
let wateringStatus = 'OFF';
let isWatering = false;

const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  mqttClient.subscribe(TOPIC_SENSOR);
});

mqttClient.on('message', (topic, message) => {
  if (topic === TOPIC_SENSOR) {
    currentSoilMoisture = parseFloat(message.toString());
    if (!isWatering && currentSoilMoisture < soilThreshold) {
      isWatering = true;
      wateringStatus = 'ON';
      mqttClient.publish(TOPIC_WATER, 'ON');
      setTimeout(() => {
        wateringStatus = 'OFF';
        mqttClient.publish(TOPIC_WATER, 'OFF');
        isWatering = false;
      }, 5000);
    }
  }
});

router.get('/status', (req, res) => {
  res.json({ currentSoilMoisture, wateringStatus, soilThreshold });
});

router.post('/set_threshold', (req, res) => {
  const { threshold } = req.body;
  if (threshold !== undefined) {
    soilThreshold = parseFloat(threshold);
    res.json({
      message: 'Порог влажности почвы обновлен',
      newThreshold: soilThreshold,
    });
  } else {
    res.status(400).json({ error: 'Укажите threshold' });
  }
});

export { router as soilRouter };
