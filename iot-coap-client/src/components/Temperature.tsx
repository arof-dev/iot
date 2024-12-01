import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
    const interval = setInterval(fetchTemperature, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'ALERT') {
        const alertMessage =
          message.level === 'HIGH'
            ? `Температура (${message.temperature}°C) превышает верхний порог!`
            : `Температура (${message.temperature}°C) ниже нижнего порога!`;
        setNotification(alertMessage);
      } else if (message.type === 'INFO') {
        setNotification(null);
      }
    };
    return () => ws.close();
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
