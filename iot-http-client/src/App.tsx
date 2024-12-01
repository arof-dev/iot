import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Humidity from './components/Humidity';
import Light from './components/Light';
import Soil from './components/Soil';
import Temperature from './components/Temperature';

const App: React.FC = () => {
  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <Typography variant='h4' align='center' gutterBottom>
        Система мониторинга IoT
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Humidity />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Light />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Soil />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Temperature />
      </Box>
    </Container>
  );
};

export default App;
