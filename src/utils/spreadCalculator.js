export const calculateSpreadEntries = (formData) => {
  const {
    narration,
    amount,
    receivedDate,
    months,
    creditAccount,
    debitAccount,
    creditTaxCode,
    debitTaxCode
  } = formData;

  const totalAmount = parseFloat(amount);
  const numberOfMonths = parseInt(months);
  const amountPerMonth = totalAmount / numberOfMonths;
  
  // Create Date object from the receivedDate
  const startDate = new Date(receivedDate);
  
  const journalEntries = [];
  
  // Create journal entries for each month
  for (let i = 0; i < numberOfMonths; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + i);
    
    const formattedDate = currentDate.toISOString().slice(0, 10);
    const monthDescription = `Month ${i + 1} of ${numberOfMonths}`;
    
    // Credit entry
    journalEntries.push({
      Narration: narration,
      Date: formattedDate,
      Description: `${monthDescription} - Credit`,
      AccountCode: creditAccount,
      TaxRate: creditTaxCode,
      Amount: amountPerMonth
    });
    
    // Debit entry
    journalEntries.push({
      Narration: narration,
      Date: formattedDate,
      Description: `${monthDescription} - Debit`,
      AccountCode: debitAccount,
      TaxRate: debitTaxCode,
      Amount: -amountPerMonth // Negative for debit
    });
  }
  
  return journalEntries;
};
