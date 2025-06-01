/**
 * Tax codes by country
 */

export const taxCodes = {
  USA: [
    { value: 'Tax Exempt (0%)', label: 'Tax Exempt (0%)' },
    { value: 'Tax on Purchases (0%)', label: 'Tax on Purchases (0%)' },
    { value: 'Tax on Sales (0%)', label: 'Tax on Sales (0%)' },
  ],
  Bermuda: [
    { value: 'Tax Exempt (0%)', label: 'Tax Exempt (0%)' },
    { value: 'Tax on Purchases (0%)', label: 'Tax on Purchases (0%)' },
    { value: 'Tax on Sales (0%)', label: 'Tax on Sales (0%)' },
  ],
  UK: [
    { value: '20% (VAT on Expenses)', label: '20% (VAT on Expenses)' },
    { value: '5% (VAT on Expenses)', label: '5% (VAT on Expenses)' },
    { value: 'EC Acquisitions (20%)', label: 'EC Acquisitions (20%)' },
    { value: 'EC Acquisitions (Zero Rated)', label: 'EC Acquisitions (Zero Rated)' },
    { value: 'Exempt Expenses', label: 'Exempt Expenses' },
    { value: 'No VAT', label: 'No VAT' },
    { value: 'Reverse Charge Expenses (20%)', label: 'Reverse Charge Expenses (20%)' },
    { value: 'Zero Rated Expenses', label: 'Zero Rated Expenses' }
  ]
};

/**
 * Get tax codes for a specific country
 * @param {string} country - Country name
 * @returns {Array} Array of tax code options
 */
export const getTaxCodesForCountry = (country) => {
  return taxCodes[country] || [];
};
