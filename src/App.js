import React, { useState } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import JournalEntries from './components/JournalEntries';
import CsvExport from './components/CsvExport';
import { calculateSpreadEntries, validateTotalAmount } from './utils/spreadCalculator';

function App() {
  const [journalEntries, setJournalEntries] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');

  const handleCalculate = (formData) => {
    const entries = calculateSpreadEntries(formData);
    const totalAmount = parseFloat(formData.amount);
    
    // Validate that the sum equals the original amount
    const isValid = validateTotalAmount(entries, totalAmount);
    
    if (isValid) {
      setValidationMessage(`✅ Validation passed: All entries sum to the original amount of ${totalAmount.toFixed(2)}`);
    } else {
      setValidationMessage(`❌ Validation failed: The sum of entries does not equal ${totalAmount.toFixed(2)}`);
    }
    
    setJournalEntries(entries);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Payment Spreader</h1>
        <p>Spread payments over a period of time</p>
      </header>
      <main>
        <div className="left-panel">
          <InputForm onCalculate={handleCalculate} />
          {journalEntries.length > 0 && (
            <div className="validation-message">{validationMessage}</div>
          )}
        </div>
        
        {journalEntries.length > 0 && (
          <div className="right-panel">
            <CsvExport entries={journalEntries} />
            <JournalEntries entries={journalEntries} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
