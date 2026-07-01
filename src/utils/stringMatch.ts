// Levenshtein distance for fuzzy string matching
export const levenshteinDistance = (str1: string, str2: string): number => {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
};

// Check if a user answer is close enough to the correct answer.
//
// Case-sensitive: capitalization is meaningful in German (nouns are
// capitalized, "sie" vs "Sie", etc.), so a case-only difference is treated as
// wrong. Whitespace is trimmed and small typos are still tolerated.
export const isAnswerCorrect = (
  userAnswer: string,
  correctAnswer: string,
  threshold: number = 2
): boolean => {
  const user = userAnswer.trim();
  const correct = correctAnswer.trim();

  // Exact, case-sensitive match.
  if (user === correct) return true;

  // A difference that is only capitalization is a real mistake in German.
  if (user.toLowerCase() === correct.toLowerCase()) return false;

  // Otherwise tolerate small typos, scaled to the answer length.
  const distance = levenshteinDistance(user, correct);
  const maxAllowedDistance = Math.min(threshold, Math.floor(correct.length * 0.2));

  return distance <= maxAllowedDistance;
};

// Normalize German special characters for easier typing
export const normalizeGerman = (text: string): string => {
  return text
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue');
};
