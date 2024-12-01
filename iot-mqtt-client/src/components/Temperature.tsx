import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mqtt from 'mqtt';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Temperature: React.FC = () => {
  const [temperatureData, setTemperatureData] = useState<
    { time: string; value: number }[]
  >([]);
  const [currentTemperature, setCurrentTemperature] = useState<number | null>(
    null
  );
  const [thresholdHigh, setThresholdHigh] = useState<number>(30);
  const [thresholdLow, setThresholdLow] = useState<number>(15);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchTemperature = async () => {
    const response = await axios.get(
      'http://localhost:3001/api/temperature/status'
    );
    const currentTime = new Date().toLocaleTimeString();
    setCurrentTemperature(response.data.currentTemperature);
    setTemperatureData((prev) => [
      ...prev.slice(-19),
      { time: currentTime, value: response.data.currentTemperature || 0 },
    ]);
  };

  const updateThresholds = async () => {
    await axios.post('http://localhost:3001/api/temperature/set_thresholds', {
      high: thresholdHigh,
      low: thresholdLow,
    });
    fetchTemperature();
  };

  useEffect(() => {
    fetchTemperature();
    const interval = setInterval(fetchTemperature, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const mqttClient = mqtt.connect('ws://localhost:9001');
    mqttClient.on('connect', () => {
      mqttClient.subscribe('temperature/alert');
    });

    mqttClient.on('message', (topic, message) => {
      if (topic === 'temperature/alert') {
        const alert = message.toString();
        setNotification(
          alert === 'HIGH'
            ? 'Температура выше допустимого порога!'
            : 'Температура ниже допустимого порога!'
        );
      }
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant='h6'>Температура</Typography>
        <Typography>
          <strong>Текущая температура:</strong>{' '}
          {currentTemperature ?? 'Нет данных'}°C
        </Typography>
        {notification && (
          <Typography color='error'>
            <strong>Уведомление:</strong> {notification}
          </Typography>
        )}
        <Box display='flex' alignItems='center' gap={2} sx={{ mt: 2 }}>
          <TextField
            label='Верхний порог'
            type='number'
            value={thresholdHigh}
            onChange={(e) => setThresholdHigh(Number(e.target.value))}
          />
          <TextField
            label='Нижний порог'
            type='number'
            value={thresholdLow}
            onChange={(e) => setThresholdLow(Number(e.target.value))}
          />
          <Button variant='contained' onClick={updateThresholds}>
            Обновить
          </Button>
        </Box>
        <ResponsiveContainer
          width='100%'
          height={300}
          style={{ marginTop: 10 }}
        >
          <LineChart data={temperatureData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='time' />
            <YAxis />
            <Tooltip />
            <Line type='monotone' dataKey='value' stroke='#ff0000' />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Temperature;
