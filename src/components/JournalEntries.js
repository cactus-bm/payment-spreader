import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Stack } from '@mui/material';
import CsvExport from './CsvExport';

const JournalEntries = ({ entries }) => {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">
          Journal Entries
        </Typography>
        {entries.length > 0 && <CsvExport entries={entries} />}
      </Stack>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="journal entries table">
          <TableHead>
            <TableRow>
              <TableCell>Narration</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Account Code</TableCell>
              <TableCell>Tax Rate</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow 
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {entry.Narration}
                </TableCell>
                <TableCell>{entry.Date}</TableCell>
                <TableCell>{entry.Description}</TableCell>
                <TableCell>{entry.AccountCode}</TableCell>
                <TableCell>{entry.TaxRate}</TableCell>
                <TableCell align="right" 
                  sx={{ 
                    color: entry.Amount < 0 ? 'error.main' : 'success.main',
                    fontWeight: 'medium'
                  }}
                >
                  {entry.Amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default JournalEntries;
