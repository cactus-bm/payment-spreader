import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box, Paper, Grid, Alert } from '@mui/material';
import InputForm from './components/InputForm';
import JournalEntries from './components/JournalEntries';
import { calculateSpreadEntries, validateTotalAmount } from './utils/spreadCalculator';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [journalEntries, setJournalEntries] = useState([]);
  const [validationMessage, setValidationMessage] = useState({ text: '', severity: 'success' });

  const handleCalculate = (formData) => {
    const entries = calculateSpreadEntries(formData);
    const totalAmount = parseFloat(formData.amount);
    
    // Validate that the sum equals the original amount
    const isValid = validateTotalAmount(entries, totalAmount);
    
    if (isValid) {
      setValidationMessage({
        text: `All entries sum to the original amount of ${totalAmount.toFixed(2)}`,
        severity: 'success'
      });
    } else {
      setValidationMessage({
        text: `The sum of entries does not equal ${totalAmount.toFixed(2)}`,
        severity: 'error'
      });
    }
    
    setJournalEntries(entries);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Payment Spreader
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Spread payments over a period of time
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item size={{
            xs: 12,
            md: 4
          }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <InputForm onCalculate={handleCalculate} />
              {journalEntries.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity={validationMessage.severity}>
                    {validationMessage.text}
                  </Alert>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {journalEntries.length > 0 && (
            <Grid item size={{
              xs: 12,
              md: 8
            }}>
              <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                <JournalEntries entries={journalEntries} />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
