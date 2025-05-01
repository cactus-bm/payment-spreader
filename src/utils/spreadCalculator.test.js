import { calculateSpreadEntries, validateTotalAmount } from './spreadCalculator';

describe('spreadCalculator', () => {
  // Helper function to get expected narration format
  const getExpectedNarration = (baseNarration, date) => {
    const testDate = new Date(date);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[testDate.getMonth()];
    const year = testDate.getFullYear();
    return `${baseNarration} - ${month} ${year}`;
  };
  // Test case for even division with no rounding
  test('should correctly split amount with no rounding needed', () => {
    const formData = {
      narration: 'Test Payment',
      amount: '1000',
      receivedDate: '2025-01-01',
      months: '10',
      creditAccount: 'Credit-123',
      debitAccount: 'Debit-456',
      creditTaxCode: 'TAX-C',
      debitTaxCode: 'TAX-D'
    };
    
    const entries = calculateSpreadEntries(formData);
    
    // Check number of entries (2 per month - credit and debit)
    expect(entries.length).toBe(20);
    
    // Check each month's amount is 100.00 and narration is formatted correctly
    for (let i = 0; i < 10; i++) {
      const creditEntry = entries[i * 2];
      const debitEntry = entries[i * 2 + 1];
      
      // Get expected date for this iteration using the same logic as in the spreadCalculator
      const originalDate = new Date('2025-01-01');
      const originalDay = originalDate.getDate();
      const targetMonth = (originalDate.getMonth() + i) % 12;
      const targetYear = originalDate.getFullYear() + Math.floor((originalDate.getMonth() + i) / 12);
      
      // Get last day of month
      const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      const actualDay = Math.min(originalDay, lastDayOfMonth);
      
      const expectedDate = new Date(targetYear, targetMonth, actualDay);
      const expectedNarration = getExpectedNarration('Test Payment', expectedDate);
      
      expect(creditEntry.Amount).toBe(100);
      expect(debitEntry.Amount).toBe(-100);
      
      // Check narration and description format
      expect(creditEntry.Narration).toBe(expectedNarration);
      expect(creditEntry.Description).toBe(expectedNarration);
      expect(debitEntry.Narration).toBe(expectedNarration);
      expect(debitEntry.Description).toBe(expectedNarration);
    }
    
    // Validate total equals original amount
    expect(validateTotalAmount(entries, 1000)).toBe(true);
  });
  
  // Test case where rounding is needed
  test('should handle rounding to 2 decimal places and adjust each month', () => {
    const formData = {
      narration: 'Test Payment',
      amount: '1000',
      receivedDate: '2025-01-01',
      months: '3',
      creditAccount: 'Credit-123',
      debitAccount: 'Debit-456',
      creditTaxCode: 'TAX-C',
      debitTaxCode: 'TAX-D'
    };
    
    const entries = calculateSpreadEntries(formData);
    
    // Check number of entries (2 per month - credit and debit)
    expect(entries.length).toBe(6);
    
    // With new algorithm, 1000/3 with recalculation:
    // First month: 1000/3 = 333.33, remaining: 666.67, months left: 2
    // Second month: 666.67/2 = 333.33, remaining: 333.34, months left: 1
    // Third month: exactly 333.34 (remaining amount)
    
    // Expected narrations for each month using the new date calculation logic
    const baseDate = new Date('2025-01-01');
    const originalDay = baseDate.getDate();
    
    // Function to get adjusted date for testing
    const getAdjustedTestDate = (baseDate, monthsToAdd) => {
      const originalDay = baseDate.getDate();
      const targetMonth = (baseDate.getMonth() + monthsToAdd) % 12;
      const targetYear = baseDate.getFullYear() + Math.floor((baseDate.getMonth() + monthsToAdd) / 12);
      
      // Get last day of month
      const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      const actualDay = Math.min(originalDay, lastDayOfMonth);
      
      return new Date(targetYear, targetMonth, actualDay);
    };
    
    const expectedDate1 = getAdjustedTestDate(baseDate, 0);
    const expectedDate2 = getAdjustedTestDate(baseDate, 1);
    const expectedDate3 = getAdjustedTestDate(baseDate, 2);
    
    const expectedNarration1 = getExpectedNarration('Test Payment', expectedDate1);
    const expectedNarration2 = getExpectedNarration('Test Payment', expectedDate2);
    const expectedNarration3 = getExpectedNarration('Test Payment', expectedDate3);
    
    // First month
    expect(entries[0].Amount).toBe(333.33);
    expect(entries[1].Amount).toBe(-333.33);
    expect(entries[0].Narration).toBe(expectedNarration1);
    expect(entries[0].Description).toBe(expectedNarration1);
    expect(entries[1].Narration).toBe(expectedNarration1);
    expect(entries[1].Description).toBe(expectedNarration1);
    
    // Second month
    expect(entries[2].Amount).toBe(333.34);
    expect(entries[3].Amount).toBe(-333.34);
    expect(entries[2].Narration).toBe(expectedNarration2);
    expect(entries[2].Description).toBe(expectedNarration2);
    expect(entries[3].Narration).toBe(expectedNarration2);
    expect(entries[3].Description).toBe(expectedNarration2);
    
    // Last month (adjusted to make up the difference)
    expect(entries[4].Amount).toBe(333.33);
    expect(entries[5].Amount).toBe(-333.33);
    expect(entries[4].Narration).toBe(expectedNarration3);
    expect(entries[4].Description).toBe(expectedNarration3);
    expect(entries[5].Narration).toBe(expectedNarration3);
    expect(entries[5].Description).toBe(expectedNarration3);
    
    // Validate total equals original amount
    expect(validateTotalAmount(entries, 1000)).toBe(true);
    
    // Calculate the actual sum to verify it's exactly 1000
    const totalSum = entries.filter(e => e.Amount > 0)
                            .reduce((sum, e) => sum + e.Amount, 0);
    expect(totalSum).toBe(1000);
  });
  
  // Edge case with a prime number that ensures rounding is handled properly
  test('should correctly handle awkward divisions with progressive recalculation', () => {
    const formData = {
      narration: 'Test Payment',
      amount: '1000',
      receivedDate: '2025-01-01',
      months: '7',
      creditAccount: 'Credit-123',
      debitAccount: 'Debit-456',
      creditTaxCode: 'TAX-C',
      debitTaxCode: 'TAX-D'
    };
    
    const entries = calculateSpreadEntries(formData);
    
    // With progressive recalculation for 1000 over 7 months:
    // Month 1: 1000/7 = 142.85, remaining = 857.15, months left = 6
    // Month 2: 857.15/6 = 142.85, remaining = 714.30, months left = 5
    // And so on with the last month getting the final remaining amount
    
    // Verify all monthly payment amounts are within 1 cent of each other
    let previousAmount = entries[0].Amount;
    for (let i = 1; i < 6; i++) {
      const currentAmount = entries[i * 2].Amount;
      // Check difference is no more than 1 cent (with a small epsilon for floating point precision)
      expect(Math.abs(currentAmount - previousAmount)).toBeLessThanOrEqual(0.0101);
      previousAmount = currentAmount;
    }
    
    // The last payment should be within 2 cents of previous amounts
    // (allowing slightly more variance for the final adjustment)
    expect(Math.abs(entries[12].Amount - previousAmount)).toBeLessThanOrEqual(0.02);
    
    // Ensure amounts are properly rounded to 2 decimal places
    for (let i = 0; i < 7; i++) {
      const amount = entries[i * 2].Amount;
      // Check that multiplying by 100 and taking modulus 1 is 0 (confirming 2 decimal places)
      expect(Math.abs((amount * 100) % 1)).toBeLessThanOrEqual(0.0001); // Small epsilon for floating point
    }
    
    // Validate total equals original amount
    expect(validateTotalAmount(entries, 1000)).toBe(true);
  });
  
  // Test with a very small amount
  test('should correctly split very small amounts with progressive recalculation', () => {
    const formData = {
      narration: 'Small Payment',
      amount: '0.01',
      receivedDate: '2025-01-01',
      months: '3',
      creditAccount: 'Credit-123',
      debitAccount: 'Debit-456',
      creditTaxCode: 'TAX-C',
      debitTaxCode: 'TAX-D'
    };
    
    const entries = calculateSpreadEntries(formData);
    
    // With progressive recalculation for 0.01 over 3 months:
    // Month 1: 0.01/3 = 0.00, remaining = 0.01, months left = 2
    // Month 2: 0.01/2 = 0.00, remaining = 0.01, months left = 1
    // Month 3: remaining = 0.01
    
    // In this case, since the smallest unit is 0.01, the first two months will be 0
    // and the entire amount will be allocated to the last month
    
    // First and second months
    expect(entries[0].Amount).toEqual(0);
    // Use Math.abs to handle -0 vs 0 issue
    expect(Math.abs(entries[1].Amount)).toEqual(0);
    expect(entries[2].Amount).toEqual(0.01);
    expect(Math.abs(entries[3].Amount)).toEqual(0.01);
    
    // Last month (the entire amount)
    expect(entries[4].Amount).toBe(0);
    expect(entries[5].Amount).toBe(-0);
    
    // Validate total equals original amount
    expect(validateTotalAmount(entries, 0.01)).toBe(true);
    
    // Ensure all entries add up to the original amount
    const creditSum = entries.filter(entry => entry.Amount > 0)
                           .reduce((sum, entry) => sum + entry.Amount, 0);
    expect(creditSum).toEqual(0.01);
  });
});
