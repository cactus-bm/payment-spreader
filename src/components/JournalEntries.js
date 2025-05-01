import React from 'react';

const JournalEntries = ({ entries }) => {
  return (
    <div className="journal-entries">
      <h2>Journal Entries</h2>
      <table>
        <thead>
          <tr>
            <th>Narration</th>
            <th>Date</th>
            <th>Description</th>
            <th>Account Code</th>
            <th>Tax Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.Narration}</td>
              <td>{entry.Date}</td>
              <td>{entry.Description}</td>
              <td>{entry.AccountCode}</td>
              <td>{entry.TaxRate}</td>
              <td>{entry.Amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JournalEntries;
