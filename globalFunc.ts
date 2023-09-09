function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 *
 * @param inputText - The input text
 * @returns - The cleaned text
 */
function cleanText(inputText: string): string {
  const cleanedText = inputText.replace(/[^a-zA-Z0-9\s]/g, '');

  const lowercaseText = cleanedText.toLowerCase();

  return lowercaseText;
}

export { sleep, cleanText };
