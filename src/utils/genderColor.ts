/**
 * Color-code the three German articles — a widely used learning aid so gender
 * is absorbed visually: der = blue, die = rose, das = green.
 */
export function genderColorClass(article?: string): string {
  switch (article) {
    case 'der':
      return 'text-blue-600 dark:text-blue-400';
    case 'die':
      return 'text-rose-500 dark:text-rose-400';
    case 'das':
      return 'text-emerald-600 dark:text-emerald-400';
    default:
      return 'text-brand-600 dark:text-brand-400';
  }
}
