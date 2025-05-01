import React, { useState } from 'react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <div className="input-form">
      <h2>Enter Payment Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="narration">Narration</label>
          <input
            type="text"
            id="narration"
            name="narration"
            value={formData.narration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="receivedDate">Date Received</label>
          <input
            type="date"
            id="receivedDate"
            name="receivedDate"
            value={formData.receivedDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="months">Number of Months</label>
          <input
            type="number"
            id="months"
            name="months"
            value={formData.months}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="creditAccount">Credit Account</label>
          <input
            type="text"
            id="creditAccount"
            name="creditAccount"
            value={formData.creditAccount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="debitAccount">Debit Account</label>
          <input
            type="text"
            id="debitAccount"
            name="debitAccount"
            value={formData.debitAccount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="creditTaxCode">Credit Tax Code</label>
          <input
            type="text"
            id="creditTaxCode"
            name="creditTaxCode"
            value={formData.creditTaxCode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="debitTaxCode">Debit Tax Code</label>
          <input
            type="text"
            id="debitTaxCode"
            name="debitTaxCode"
            value={formData.debitTaxCode}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Calculate Journal Entries</button>
      </form>
    </div>
  );
};

export default InputForm;
