/**
 * Calculates journal entries with amounts spread over multiple months
 * @param {Object} formData - The form data containing payment details
 * @returns {Array} Array of journal entries
 */
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
  
  // Calculate amount per month, rounded to 2 decimal places
  let amountPerMonth = Math.floor((totalAmount / numberOfMonths) * 100) / 100;
  
  // Calculate the difference due to rounding that needs to be added to the last month
  const roundingDifference = (totalAmount - (amountPerMonth * numberOfMonths)).toFixed(2);
  
  // Create Date object from the receivedDate
  const startDate = new Date(receivedDate);
  
  const journalEntries = [];
  
  // Array of full month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Create journal entries for each month
  for (let i = 0; i < numberOfMonths; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + i);
    
    const formattedDate = currentDate.toISOString().slice(0, 10);
    
    // Get full month name and year for narration
    const fullMonthName = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const formattedNarration = `${narration} - ${fullMonthName} ${year}`;
    
    // For the last month, adjust the amount to ensure the total is correct
    let monthAmount = amountPerMonth;
    if (i === numberOfMonths - 1 && parseFloat(roundingDifference) !== 0) {
      monthAmount = parseFloat((amountPerMonth + parseFloat(roundingDifference)).toFixed(2));
    }
    
    // Credit entry
    journalEntries.push({
      Narration: formattedNarration,
      Date: formattedDate,
      Description: formattedNarration, // Same as Narration
      AccountCode: creditAccount,
      TaxRate: creditTaxCode,
      Amount: monthAmount
    });
    
    // Debit entry
    journalEntries.push({
      Narration: formattedNarration,
      Date: formattedDate,
      Description: formattedNarration, // Same as Narration
      AccountCode: debitAccount,
      TaxRate: debitTaxCode,
      Amount: -monthAmount // Negative for debit
    });
  }
  
  return journalEntries;
};

/**
 * Validates that the total of all entries equals the original amount
 * @param {Array} entries - Array of journal entries
 * @param {number} originalAmount - The original amount to be split
 * @returns {boolean} - Whether the total matches the original amount
 */
export const validateTotalAmount = (entries, originalAmount) => {
  // Filter for credit entries only (to avoid counting debits as well)
  const creditEntries = entries.filter(entry => entry.Amount > 0);
  
  // Sum all credit entries
  const totalSum = creditEntries.reduce((sum, entry) => sum + entry.Amount, 0);
  
  // Compare with original amount, allowing for small floating point differences
  return Math.abs(totalSum - originalAmount) < 0.01;
};
