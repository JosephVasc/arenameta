export const formatText = (text: string): string => {
  if (!text) return '';
  
  // Handle special cases
  const specialCases: { [key: string]: string } = {
    'horde': 'Horde',
    'alliance': 'Alliance',
    '2v2': '2v2',
    '3v3': '3v3',
    '5v5': '5v5'
  };

  // Check if it's a special case
  const lowerText = text.toLowerCase();
  if (specialCases[lowerText]) {
    return specialCases[lowerText];
  }

  // Format realm names and other text
  return text
    .split(/[-_]/) // Split by hyphen or underscore
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}; 