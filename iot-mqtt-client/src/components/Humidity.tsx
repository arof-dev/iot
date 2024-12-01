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

const Humidity: React.FC = () => {
  const [humidityData, setHumidityData] = useState<
    { time: string; value: number }[]
  >([]);
  const [currentHumidity, setCurrentHumidity] = useState<number | null>(null);
  const [fanStatus, setFanStatus] = useState<string>('OFF');
  const [threshold, setThreshold] = useState<number>(50);

  const fetchData = async () => {
    const response = await axios.get(
      'http://localhost:3001/api/humidity/status'
    );
    const currentTime = new Date().toLocaleTimeString();
    setCurrentHumidity(response.data.currentHumidity);
    setFanStatus(response.data.fanStatus);
    setHumidityData((prev) => [
      ...prev.slice(-19),
      { time: currentTime, value: response.data.currentHumidity || 0 },
    ]);
  };

  const updateThreshold = async () => {
    await axios.post('http://localhost:3001/api/humidity/set_threshold', {
      threshold,
    });
    fetchData();
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant='h6'>Влажность</Typography>
        <Typography>
          <strong>Текущая влажность:</strong> {currentHumidity ?? 'Нет данных'}%
        </Typography>
        <Typography>
          <strong>Состояние вентилятора:</strong>{' '}
          {fanStatus === 'ON' ? 'Включен' : 'Выключен'}
        </Typography>
        <Box display='flex' alignItems='center' gap={2} sx={{ mt: 2 }}>
          <TextField
            label='Порог влажности'
            type='number'
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />
          <Button variant='contained' onClick={updateThreshold}>
            Обновить
          </Button>
        </Box>
        <ResponsiveContainer
          width='100%'
          height={300}
          style={{ marginTop: 10 }}
        >
          <LineChart data={humidityData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='time' />
            <YAxis />
            <Tooltip />
            <Line type='monotone' dataKey='value' stroke='#8884d8' />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Humidity;
