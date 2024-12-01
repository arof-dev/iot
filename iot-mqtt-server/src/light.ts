import { Router } from 'express';
import mqtt from 'mqtt';

const router = Router();
const MQTT_BROKER = 'mqtt://localhost:1883';
const TOPIC_SENSOR = 'light/sensor';
const TOPIC_LAMP = 'light/lamp';

let currentLight: number | null = null;
let lightThreshold = 300;
let lampStatus = 'OFF';

const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  mqttClient.subscribe(TOPIC_SENSOR);
});

mqttClient.on('message', (topic, message) => {
  if (topic === TOPIC_SENSOR) {
    currentLight = parseFloat(message.toString());
    if (currentLight < lightThreshold) {
      lampStatus = 'ON';
      mqttClient.publish(TOPIC_LAMP, 'ON');
    } else {
      lampStatus = 'OFF';
      mqttClient.publish(TOPIC_LAMP, 'OFF');
    }
  }
});

router.get('/status', (req, res) => {
  res.json({ currentLight, lampStatus, lightThreshold });
});

router.post('/set_threshold', (req, res) => {
  const { threshold } = req.body;
  if (threshold !== undefined) {
    lightThreshold = parseFloat(threshold);
    res.json({
      message: 'Порог освещенности обновлен',
      newThreshold: lightThreshold,
    });
  } else {
    res.status(400).json({ error: 'Укажите threshold' });
  }
});

export { router as lightRouter };
