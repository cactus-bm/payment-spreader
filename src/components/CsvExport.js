import React from 'react';
import { Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { stringify } from 'csv-stringify/browser/esm/sync';

const CsvExport = ({ entries }) => {
  const generateCsv = () => {
    const csvContent = stringify(entries, {
      header: true,
      columns: ['Narration', 'Date', 'Description', 'AccountCode', 'TaxRate', 'Amount']
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `journal_entries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={generateCsv}
      startIcon={<DownloadIcon />}
    >
      Download CSV
    </Button>
  );
};

export default CsvExport;
