export default function truncateLongText(text, maxLength = 20, suffix = '...', wordBoundary = true) {
  // Handle edge cases
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  // Calculate the actual truncation point considering the suffix length
  const truncateAt = maxLength - suffix.length;
  
  if (truncateAt <= 0) {
    return suffix;
  }
  
  let truncated = text.substring(0, truncateAt);
  
  // If wordBoundary is true, find the last complete word
  if (wordBoundary) {
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    if (lastSpaceIndex > 0) {
      truncated = truncated.substring(0, lastSpaceIndex);
    }
  }
  
  return truncated + suffix;
}