export const downloadSampleCSV = () => {
  const headers = ['Date', 'Amount', 'Category', 'Type'];
  const sampleData = [
    ['2024-04-01', '50000', 'Salaries', 'expense'],
    ['2024-04-02', '120000', 'Revenue', 'income'],
    ['2024-04-03', '1500', 'Software/Tools', 'expense'],
  ];

  const csvContent = [
    headers.join(','),
    ...sampleData.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'finance_sample.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
