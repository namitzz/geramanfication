export interface Lesson {
  id: string;
  de: string;
  en: string;
  topic: string;
  notes?: string;
  type: string;
}

/** Human-readable topic label (e.g. "week1_greetings" -> "Week 1: greetings"). */
export const formatTopic = (topic: string): string =>
  topic === 'all'
    ? 'All Topics'
    : topic.replace('_', ' ').replace('week1 ', 'Week 1: ');
