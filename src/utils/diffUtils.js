// src/utils/diffUtils.js
export function showMistake(expected, actual) {
  const expectedWords = expected.toLowerCase().split(" ");
  const actualWords = actual.toLowerCase().split(" ");

  const feedback = expectedWords.map((word, i) => {
    if (actualWords[i] === word) return `✅ ${word}`;
    return `❌ ${word}`;
  });

  return feedback.join(" ");
}
