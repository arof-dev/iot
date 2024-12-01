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

const Soil: React.FC = () => {
  const [soilData, setSoilData] = useState<{ time: string; value: number }[]>(
    []
  );
  const [currentSoilMoisture, setCurrentSoilMoisture] = useState<number | null>(
    null
  );
  const [wateringStatus, setWateringStatus] = useState<string>('OFF');
  const [threshold, setThreshold] = useState<number>(30);

  const fetchData = async () => {
    const response = await axios.get('http://localhost:3001/api/soil/status');
    const currentTime = new Date().toLocaleTimeString();
    setCurrentSoilMoisture(response.data.currentSoilMoisture);
    setWateringStatus(response.data.wateringStatus);
    setSoilData((prev) => [
      ...prev.slice(-19),
      { time: currentTime, value: response.data.currentSoilMoisture || 0 },
    ]);
  };

  const updateThreshold = async () => {
    await axios.post('http://localhost:3001/api/soil/set_threshold', {
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
        <Typography variant='h6'>Влажность почвы</Typography>
        <Typography>
          <strong>Текущая влажность почвы:</strong>{' '}
          {currentSoilMoisture ?? 'Нет данных'}%
        </Typography>
        <Typography>
          <strong>Состояние полива:</strong>{' '}
          {wateringStatus === 'ON' ? 'Включен' : 'Выключен'}
        </Typography>
        <Box display='flex' alignItems='center' gap={2} sx={{ mt: 2 }}>
          <TextField
            label='Порог влажности почвы'
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
          <LineChart data={soilData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='time' />
            <YAxis />
            <Tooltip />
            <Line type='monotone' dataKey='value' stroke='#ff7300' />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Soil;
