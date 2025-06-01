import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Grid, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem, InputLabel, Autocomplete } from '@mui/material';
import { getTaxCodesForCountry } from '../utils/taxCodes';
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
    debitTaxCode: '',
    country: 'USA'
  });
  
  const [taxCodes, setTaxCodes] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle country change separately to update tax codes
    if (name === 'country') {
      // Reset tax code values when country changes
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
        creditTaxCode: '',
        debitTaxCode: ''
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };
  
  // Update tax codes when country changes
  useEffect(() => {
    const countryTaxCodes = getTaxCodesForCountry(formData.country);
    setTaxCodes(countryTaxCodes);
  }, [formData.country]);
  
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
                format="MMM DD, YYYY"
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
          
          <Grid item size={{ xs: 12 }}>
            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              The Credit Account is the one being added to and the Debit Account is the one being subtracted from.
            </Typography>
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
            <Autocomplete
              id="creditTaxCode"
              options={taxCodes}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
              freeSolo
              value={formData.creditTaxCode ? taxCodes.find(tc => tc.value === formData.creditTaxCode) || formData.creditTaxCode : null}
              onChange={(event, newValue) => {
                setFormData(prevData => ({
                  ...prevData,
                  creditTaxCode: typeof newValue === 'string' ? newValue : (newValue ? newValue.value : '')
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Credit Tax Code"
                  margin="normal"
                  required
                  fullWidth
                />
              )}
            />
          </Grid>
          
          <Grid item size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              id="debitTaxCode"
              options={taxCodes}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
              freeSolo
              value={formData.debitTaxCode ? taxCodes.find(tc => tc.value === formData.debitTaxCode) || formData.debitTaxCode : null}
              onChange={(event, newValue) => {
                setFormData(prevData => ({
                  ...prevData,
                  debitTaxCode: typeof newValue === 'string' ? newValue : (newValue ? newValue.value : '')
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Debit Tax Code"
                  margin="normal"
                  required
                  fullWidth
                />
              )}
            />
          </Grid>
          
          <Grid item size={{ xs: 12 }}>
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Country</FormLabel>
              <RadioGroup
                row
                aria-label="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                <FormControlLabel value="USA" control={<Radio />} label="USA" />
                <FormControlLabel value="Bermuda" control={<Radio />} label="Bermuda" />
                <FormControlLabel value="UK" control={<Radio />} label="UK" />
              </RadioGroup>
            </FormControl>
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
