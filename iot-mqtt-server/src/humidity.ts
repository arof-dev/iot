import { Router } from 'express';
import mqtt from 'mqtt';

const router = Router();
const MQTT_BROKER = 'mqtt://localhost:1883';
const TOPIC_SENSOR = 'humidity/sensor';
const TOPIC_FAN = 'humidity/fan';

let currentHumidity: number | null = null;
let humidityThreshold = 50;
let fanStatus = 'OFF';

const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  mqttClient.subscribe(TOPIC_SENSOR);
});

mqttClient.on('message', (topic, message) => {
  if (topic === TOPIC_SENSOR) {
    currentHumidity = parseFloat(message.toString());
    if (currentHumidity > humidityThreshold) {
      fanStatus = 'ON';
      mqttClient.publish(TOPIC_FAN, 'ON');
    } else {
      fanStatus = 'OFF';
      mqttClient.publish(TOPIC_FAN, 'OFF');
    }
  }
});

router.get('/status', (req, res) => {
  res.json({ currentHumidity, fanStatus, humidityThreshold });
});

router.post('/set_threshold', (req, res) => {
  const { threshold } = req.body;
  if (threshold !== undefined) {
    humidityThreshold = parseFloat(threshold);
    res.json({
      message: 'Порог влажности обновлен',
      newThreshold: humidityThreshold,
    });
  } else {
    res.status(400).json({ error: 'Укажите threshold' });
  }
});

export { router as humidityRouter };
