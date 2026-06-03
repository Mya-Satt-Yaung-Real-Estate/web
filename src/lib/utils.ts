// Utility helpers

export function cn(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(' ');
}

export function formatPriceLakh(
  price: string,
  priceLakh?: string | number | null,
  language: 'en' | 'mm' = 'en',
  currency: string = 'MMK',
  priceAmount?: string | number | null
): string {
  const normalizedCurrency = (currency || 'MMK').toUpperCase();

  if (normalizedCurrency !== 'MMK') {
    const amount = priceAmount ?? price;
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (numericAmount === null || numericAmount === undefined || isNaN(numericAmount)) {
      return String(amount || '');
    }

    const formattedAmount = numericAmount.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });

    if (normalizedCurrency === 'THB') return `${formattedAmount} Baht`;
    if (normalizedCurrency === 'CNY') return `${formattedAmount} Yuan`;
    return `${formattedAmount} ${normalizedCurrency}`;
  }

  if (priceLakh !== null && priceLakh !== undefined) {
    const lakhValue = typeof priceLakh === 'string' ? parseFloat(priceLakh) : priceLakh;
    
    // Format to remove unnecessary decimals (e.g., 3.00 -> 3, 3.50 -> 3.5)
    const formattedLakh = lakhValue % 1 === 0 
      ? lakhValue.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : lakhValue.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
    
    // Return Myanmar format if language is Myanmar
    if (language === 'mm') {
      return `${formattedLakh} သိန်း`;
    }
    return `${formattedLakh} Lakhs`;
  }
  
  // Fallback to original format if price_lakh not available
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return price;
  return `${numPrice.toLocaleString()} MMK`;
}

export function formatCurrencyUnit(
  currency: string = 'MMK',
  language: 'en' | 'mm' = 'en'
): string {
  const normalizedCurrency = (currency || 'MMK').toUpperCase();

  if (normalizedCurrency === 'MMK') {
    return language === 'mm' ? 'သိန်း' : 'Lakh';
  }
  if (normalizedCurrency === 'THB') return 'Baht';
  if (normalizedCurrency === 'CNY') return 'Yuan';
  return normalizedCurrency;
}

export function formatCurrencyAmount(
  amount?: string | number | null,
  currency: string = 'MMK',
  language: 'en' | 'mm' = 'en'
): string {
  if (amount === null || amount === undefined || amount === '') {
    return '-';
  }

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) {
    return String(amount);
  }

  const formattedAmount = numericAmount.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  return `${formattedAmount} ${formatCurrencyUnit(currency, language)}`;
}





