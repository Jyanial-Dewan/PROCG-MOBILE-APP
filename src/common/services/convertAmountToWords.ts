export const convertAmountToWords = (number: number): string => {
  const units: string[] = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ];
  const teens: string[] = [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  const tens: string[] = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];
  const thousands: string[] = [
    '',
    'thousand',
    'million',
    'billion',
    'trillion',
  ];

  function convertLessThanOneThousand(num: number): string {
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] + ' ' + convertLessThanOneThousand(num % 10)
      );
    return (
      units[Math.floor(num / 100)] +
      ' hundred ' +
      convertLessThanOneThousand(num % 100)
    );
  }

  function convertToWords(num: number): string {
    if (num === 0) return 'zero';

    let integerPart = Math.floor(num);
    const fractionalPart = Math.round((num - integerPart) * 100);

    let word = '';

    // Convert integer part
    if (integerPart !== 0) {
      for (let i = 0; i < thousands.length; i++) {
        if (integerPart % 1000 !== 0) {
          word =
            convertLessThanOneThousand(integerPart % 1000) +
            ' ' +
            thousands[i] +
            ' ' +
            word;
        }
        integerPart = Math.floor(integerPart / 1000);
      }
    }

    // Convert fractional part
    if (fractionalPart !== 0) {
      word +=
        (word !== '' ? 'and ' : '') +
        convertLessThanOneThousand(fractionalPart) +
        ' cents';
    }

    return word.trim();
  }

  return convertToWords(number);
};
