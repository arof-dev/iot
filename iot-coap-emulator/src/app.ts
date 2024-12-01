import { request } from 'coap';

let currentHumidity = 50;
let currentLight = 400;
let currentSoilMoisture = 40;
let currentTemperature = 22;

const updateValue = (path: string, value: number) => {
  const req = request({
    hostname: 'localhost',
    port: 5683,
    pathname: path,
    method: 'PUT',
  });

  req.write(JSON.stringify({ value: value.toFixed(1) }));
  req.end();
};

setInterval(() => {
  try {
    currentHumidity += Math.random() * 2 - 1;
    currentLight += Math.random() * 20 - 10;
    currentSoilMoisture += Math.random() * 5 - 2;
    currentTemperature += Math.random() * 0.5 - 0.25;

    updateValue('/humidity', currentHumidity);
    updateValue('/light', currentLight);
    updateValue('/soil', currentSoilMoisture);
    updateValue('/temperature', currentTemperature);
  } catch (error) {
    console.error('Ошибка обновления значений', error);
  }
}, 3000);
