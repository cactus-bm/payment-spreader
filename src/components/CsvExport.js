import React from 'react';
import { stringify } from 'csv-stringify/browser/esm/sync';

// Format date from YYYY-MM-DD to DD/MM/YYYY
const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

const CsvExport = ({ entries }) => {
  const generateCsv = () => {
    // Format the dates before generating CSV
    const formattedEntries = entries.map(entry => ({
      ...entry,
      Date: formatDate(entry.Date)
    }));
    
    const csvContent = stringify(formattedEntries, {
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
    <div className="csv-export">
      <button onClick={generateCsv}>Download CSV</button>
    </div>
  );
};

export default CsvExport;
