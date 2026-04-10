const a = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];
const b = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

/**
 * Converts a small number (< 1000) to words.
 */
function convertToWords(num: number): string {
  if (num === 0) return '';
  if (num < 20) return a[num];
  if (num < 100) return b[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + a[num % 10] : '');
  return a[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' and ' + convertToWords(num % 100) : '');
}

/**
 * Converts a number to Indian system words (Lakhs/Crores).
 */
export function numberToWords(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(n) || n === 0) return '';

  const isNegative = n < 0;
  const absN = Math.abs(n);
  const rupees = Math.floor(absN);
  const paise = Math.round((absN - rupees) * 100);

  let result = '';

  if (isNegative) result += 'negative ';

  if (rupees === 0 && paise === 0) return 'zero rupees';

  if (rupees > 0) {
    const crores = Math.floor(rupees / 10000000);
    const remainderCrores = rupees % 10000000;
    const lakhs = Math.floor(remainderCrores / 100000);
    const remainderLakhs = remainderCrores % 100000;
    const thousands = Math.floor(remainderLakhs / 1000);
    const remainderThousands = remainderLakhs % 1000;

    if (crores > 0) result += convertToWords(crores) + ' crore ';
    if (lakhs > 0) result += convertToWords(lakhs) + ' lakh ';
    if (thousands > 0) result += convertToWords(thousands) + ' thousand ';
    if (remainderThousands > 0) result += convertToWords(remainderThousands);

    result = result.trim() + (rupees === 1 ? ' rupee' : ' rupees');
  }

  if (paise > 0) {
    if (result !== '') result += ' and ';
    result += convertToWords(paise) + ' paise';
  }

  // Capitalize first letter and return
  return result.charAt(0).toUpperCase() + result.slice(1);
}
