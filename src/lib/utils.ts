// Utility helpers

export function cn(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(' ');
}

export function formatPriceLakh(
  price: string,
  priceLakh?: string | number | null,
  language: 'en' | 'mm' = 'en'
): string {
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





