import axios from 'axios';

let currentHumidity = 50;
let currentLight = 400;
let currentSoilMoisture = 40;
let currentTemperature = 22;

setInterval(async () => {
  try {
    currentHumidity += Math.random() * 2 - 1;
    currentLight += Math.random() * 20 - 10;
    currentSoilMoisture += Math.random() * 5 - 2;
    currentTemperature += Math.random() * 0.5 - 0.25;

    await axios.post('http://localhost:3001/api/humidity/update', {
      value: currentHumidity.toFixed(1),
    });
    await axios.post('http://localhost:3001/api/light/update', {
      value: currentLight.toFixed(1),
    });
    await axios.post('http://localhost:3001/api/soil/update', {
      value: currentSoilMoisture.toFixed(1),
    });
    await axios.post('http://localhost:3001/api/temperature/update', {
      value: currentTemperature.toFixed(1),
    });
  } catch (error: any) {
    console.error('Ошибка при отправке данных:', error.message);
  }
}, 3000);
