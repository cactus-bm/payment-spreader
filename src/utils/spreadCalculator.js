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
  
  // Track the remaining amount to be distributed
  let remainingAmount = totalAmount;
  let remainingMonths = numberOfMonths;
  
  // Create Date object from the receivedDate
  const startDate = new Date(receivedDate);
  
  const journalEntries = [];
  
  // Array of full month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Get the day of the month from the start date
  const originalDay = startDate.getDate();
  // Function to get the last day of a month
  const getLastDayOfMonth = (year, month) => {
    if (month === 0) {
      return 31;
    } else if (month === 1) {
      if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)  ) {
        return 29;
      } else {
        return 28;
      }
    } else if (month === 2) {
      return 31;
    } else if (month === 3) {
      return 30;
    } else if (month === 4) {
      return 31;
    } else if (month === 5) {
      return 30;
    } else if (month === 6) {
      return 31;
    } else if (month === 7) {
      return 31;
    } else if (month === 8) {
      return 30;
    } else if (month === 9) {
      return 31;
    } else if (month === 10) {
      return 30;
    } else if (month === 11) {
      return 31;
    }
  };
  
  // Function to create date with same day or last day of month if that day doesn't exist
  const getAdjustedDate = (year, month, desiredDay) => {
    const lastDayOfMonth = getLastDayOfMonth(year, month)
    const actualDay = Math.min(desiredDay, lastDayOfMonth);
    const oneIndexedMonth = month + 1;
    return `${actualDay < 10 ? "0" : ""}${actualDay}/${oneIndexedMonth < 10 ? "0" : ""}${oneIndexedMonth}/${year}`;
  };
  
  // Create journal entries for each month
  for (let i = 0; i < numberOfMonths; i++) {
    // Get the target month and year
    const targetMonth = (startDate.getMonth() + i) % 12;
    const targetYear = startDate.getFullYear() + Math.floor((startDate.getMonth() + i) / 12);
    
    // Create date with same day or last day of month if that day doesn't exist
    const currentDate = getAdjustedDate(targetYear, targetMonth, originalDay);
    
    // Get full month name and year for narration
    const fullMonthName = monthNames[targetMonth];
    const formattedNarration = `${narration} - ${fullMonthName} ${targetYear}`;
    
    // Calculate this month's amount based on remaining amount and months
    let monthAmount;
    
    if (i === numberOfMonths - 1) {
      // Last month gets whatever is remaining to ensure total is exact
      monthAmount = parseFloat(remainingAmount.toFixed(2));
    } else {
      // For other months, recalculate based on remaining amount and months
      monthAmount = Math.round((remainingAmount / remainingMonths) * 100) / 100;
      remainingAmount -= monthAmount;
      remainingMonths--;
    }
    
    // Credit entry
    journalEntries.push({
      Narration: formattedNarration,
      Date: currentDate,
      Description: formattedNarration, // Same as Narration
      AccountCode: creditAccount,
      TaxRate: creditTaxCode,
      Amount: monthAmount
    });
    
    // Debit entry
    journalEntries.push({
      Narration: formattedNarration,
      Date: currentDate,
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
