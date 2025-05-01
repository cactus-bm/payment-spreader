import React, { useState } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import JournalEntries from './components/JournalEntries';
import CsvExport from './components/CsvExport';
import { calculateSpreadEntries } from './utils/spreadCalculator';

function App() {
  const [journalEntries, setJournalEntries] = useState([]);

  const handleCalculate = (formData) => {
    const entries = calculateSpreadEntries(formData);
    setJournalEntries(entries);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Payment Spreader</h1>
        <p>Spread payments over a period of time</p>
      </header>
      <main>
        <InputForm onCalculate={handleCalculate} />
        {journalEntries.length > 0 && (
          <>
            <JournalEntries entries={journalEntries} />
            <CsvExport entries={journalEntries} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
