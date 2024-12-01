import mqtt from 'mqtt';

const MQTT_BROKER = 'mqtt://localhost:1883';

const TOPIC_HUMIDITY_SENSOR = 'humidity/sensor';
const TOPIC_HUMIDITY_FAN = 'humidity/fan';

const TOPIC_LIGHT_SENSOR = 'light/sensor';
const TOPIC_LIGHT_LAMP = 'light/lamp';

const TOPIC_SOIL_SENSOR = 'soil/sensor';
const TOPIC_SOIL_WATER = 'soil/water';

const TOPIC_TEMPERATURE_SENSOR = 'temperature/sensor';
const TOPIC_TEMPERATURE_ALERT = 'temperature/alert';

let currentHumidity = 50;
let currentLight = 400;
let currentSoilMoisture = 40;
let currentTemperature = 22;

let fanState = 'OFF';
let lampState = 'OFF';
let wateringState = 'OFF';

const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  console.log('Эмулятор подключен к MQTT');
  mqttClient.subscribe([
    TOPIC_HUMIDITY_FAN,
    TOPIC_LIGHT_LAMP,
    TOPIC_SOIL_WATER,
    TOPIC_TEMPERATURE_ALERT,
  ]);

  setInterval(() => {
    currentHumidity +=
      fanState === 'ON' ? -Math.random() * 5 : Math.random() * 3;
    currentHumidity = Math.max(0, Math.min(100, currentHumidity));
    mqttClient.publish(TOPIC_HUMIDITY_SENSOR, currentHumidity.toFixed(1));

    currentLight +=
      lampState === 'ON' ? Math.random() * 10 : -Math.random() * 10;
    currentLight = Math.max(0, Math.min(1000, currentLight));
    mqttClient.publish(TOPIC_LIGHT_SENSOR, currentLight.toFixed(1));

    if (wateringState === 'ON') {
      currentSoilMoisture += Math.random() * 5;
    } else {
      currentSoilMoisture -= Math.random() * 2;
    }
    currentSoilMoisture = Math.max(0, Math.min(100, currentSoilMoisture));
    mqttClient.publish(TOPIC_SOIL_SENSOR, currentSoilMoisture.toFixed(1));

    currentTemperature += Math.random() * 0.5 - 0.25;
    mqttClient.publish(TOPIC_TEMPERATURE_SENSOR, currentTemperature.toFixed(1));
  }, 3000);
});

mqttClient.on('message', (topic, message) => {
  if (topic === TOPIC_HUMIDITY_FAN) {
    fanState = message.toString();
  } else if (topic === TOPIC_LIGHT_LAMP) {
    lampState = message.toString();
  } else if (topic === TOPIC_SOIL_WATER) {
    wateringState = message.toString();
  }
});
