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

const Light: React.FC = () => {
  const [lightData, setLightData] = useState<{ time: string; value: number }[]>(
    []
  );
  const [currentLight, setCurrentLight] = useState<number | null>(null);
  const [lampStatus, setLampStatus] = useState<string>('OFF');
  const [threshold, setThreshold] = useState<number>(300);

  const fetchData = async () => {
    const response = await axios.get('http://localhost:3001/api/light/status');
    const currentTime = new Date().toLocaleTimeString();
    setCurrentLight(response.data.currentLight);
    setLampStatus(response.data.lampStatus);
    setLightData((prev) => [
      ...prev.slice(-19),
      { time: currentTime, value: response.data.currentLight || 0 },
    ]);
  };

  const updateThreshold = async () => {
    await axios.post('http://localhost:3001/api/light/set_threshold', {
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
        <Typography variant='h6'>Освещенность</Typography>
        <Typography>
          <strong>Текущая освещенность:</strong> {currentLight ?? 'Нет данных'}{' '}
          люкс
        </Typography>
        <Typography>
          <strong>Состояние лампы:</strong>{' '}
          {lampStatus === 'ON' ? 'Включена' : 'Выключена'}
        </Typography>
        <Box display='flex' alignItems='center' gap={2} sx={{ mt: 2 }}>
          <TextField
            label='Порог освещенности'
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
          <LineChart data={lightData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='time' />
            <YAxis />
            <Tooltip />
            <Line type='monotone' dataKey='value' stroke='#82ca9d' />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Light;
