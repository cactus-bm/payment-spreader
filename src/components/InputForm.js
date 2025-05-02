import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const InputForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    narration: '',
    amount: '',
    receivedDate: '',
    months: '',
    creditAccount: '',
    debitAccount: '',
    creditTaxCode: '',
    debitTaxCode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD');
      setFormData(prevData => ({
        ...prevData,
        receivedDate: formattedDate
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Enter Payment Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Narration"
              id="narration"
              name="narration"
              value={formData.narration}
              onChange={handleChange}
              required
              variant="outlined"
              margin="normal"
            />
          </Grid>
          
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Amount"
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              inputProps={{ step: "0.01" }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          
          <Grid item size={{ xs: 12, sm:6 }}>
            <TextField
              fullWidth
              label="Number of Months"
              id="months"
              name="months"
              type="number"
              value={formData.months}
              onChange={handleChange}
              required
              inputProps={{ min: "1" }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          
          <Grid item size={{ xs: 12 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date Received"
                value={formData.receivedDate ? dayjs(formData.receivedDate) : null}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    margin: "normal"
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Credit Account"
              id="creditAccount"
              name="creditAccount"
              value={formData.creditAccount}
              onChange={handleChange}
              required
              variant="outlined"
              margin="normal"
            />
          </Grid>
          
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Debit Account"
              id="debitAccount"
              name="debitAccount"
              value={formData.debitAccount}
              onChange={handleChange}
              required
              variant="outlined"
              margin="normal"
            />
          </Grid>
          
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Credit Tax Code"
              id="creditTaxCode"
              name="creditTaxCode"
              value={formData.creditTaxCode}
              onChange={handleChange}
              required
              variant="outlined"
              margin="normal"
            />
          </Grid>
          
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Debit Tax Code"
              id="debitTaxCode"
              name="debitTaxCode"
              value={formData.debitTaxCode}
              onChange={handleChange}
              required
              variant="outlined"
              margin="normal"
            />
          </Grid>
          
          <Grid item size={{ xs: 12 }}>
            <Box sx={{ mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                fullWidth
              >
                Calculate Journal Entries
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default InputForm;
