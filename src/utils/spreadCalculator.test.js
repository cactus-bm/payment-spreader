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
      
      // Get expected date for this iteration
      const expectedDate = new Date('2025-01-01');
      expectedDate.setMonth(expectedDate.getMonth() + i);
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
  test('should handle rounding to 2 decimal places and adjust last month', () => {
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
    
    // For 1000/3, we expect first two months to be 333.33 and last month to be 333.34
    // But our algorithm rounds down to 2 decimal places so we'll have 333.33 for first two months
    // and the last month will be adjusted to make up the total
    
    // Expected narrations for each month
    const expectedNarration1 = getExpectedNarration('Test Payment', new Date('2025-01-01'));
    const expectedNarration2 = getExpectedNarration('Test Payment', new Date('2025-02-01'));
    const expectedNarration3 = getExpectedNarration('Test Payment', new Date('2025-03-01'));
    
    // First month
    expect(entries[0].Amount).toBe(333.33);
    expect(entries[1].Amount).toBe(-333.33);
    expect(entries[0].Narration).toBe(expectedNarration1);
    expect(entries[0].Description).toBe(expectedNarration1);
    expect(entries[1].Narration).toBe(expectedNarration1);
    expect(entries[1].Description).toBe(expectedNarration1);
    
    // Second month
    expect(entries[2].Amount).toBe(333.33);
    expect(entries[3].Amount).toBe(-333.33);
    expect(entries[2].Narration).toBe(expectedNarration2);
    expect(entries[2].Description).toBe(expectedNarration2);
    expect(entries[3].Narration).toBe(expectedNarration2);
    expect(entries[3].Description).toBe(expectedNarration2);
    
    // Last month (adjusted to make up the difference)
    expect(entries[4].Amount).toBe(333.34);
    expect(entries[5].Amount).toBe(-333.34);
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
  test('should correctly handle awkward divisions with rounding', () => {
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
    
    // Calculate the expected amount per month (142.85 for 7 months, which is 999.95)
    // So the last month should be 142.90 to make up the total of 1000
    const expectedAmountPerMonth = Math.floor((1000 / 7) * 100) / 100; // 142.85
    
    // Check each month except last has the expected amount
    for (let i = 0; i < 6; i++) {
      expect(entries[i * 2].Amount).toBe(expectedAmountPerMonth);
      expect(entries[i * 2 + 1].Amount).toBe(-expectedAmountPerMonth);
    }
    
    // Check last month is adjusted correctly
    // Use toBeCloseTo for floating point comparison to handle precision issues
    expect(entries[12].Amount).toBeCloseTo(1000 - (expectedAmountPerMonth * 6), 2);
    expect(entries[13].Amount).toBeCloseTo(-(1000 - (expectedAmountPerMonth * 6)), 2);
    
    // Validate total equals original amount
    expect(validateTotalAmount(entries, 1000)).toBe(true);
  });
  
  // Test with a very small amount
  test('should correctly split very small amounts', () => {
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
    
    // For 0.01/3, we expect first two months to be 0.00 and last month to be 0.01
    
    // First and second months
    expect(entries[0].Amount).toEqual(0);
    // Use Object.is to handle -0 vs 0 issue
    expect(Math.abs(entries[1].Amount)).toEqual(0);
    expect(entries[2].Amount).toEqual(0);
    expect(Math.abs(entries[3].Amount)).toEqual(0);
    
    // Last month (the entire amount)
    expect(entries[4].Amount).toBe(0.01);
    expect(entries[5].Amount).toBe(-0.01);
    
    // Validate total equals original amount
    expect(validateTotalAmount(entries, 0.01)).toBe(true);
  });
});
