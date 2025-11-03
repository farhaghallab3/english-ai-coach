import { diffWords } from "diff";

/**
 * Compare the correct and spoken sentences and highlight mistakes.
 */
export const showMistake = (correctSentence, userSentence) => {
  const differences = diffWords(
    correctSentence.toLowerCase(),
    userSentence.toLowerCase()
  );

  let feedback = "";
  differences.forEach((part) => {
    if (part.added) {
      feedback += `❌ You added "${part.value.trim()}" `;
    } else if (part.removed) {
      feedback += `❌ You missed "${part.value.trim()}" `;
    }
  });

  return feedback || "✅ Perfect!";
};
