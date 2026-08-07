import { useState } from 'react';
import { useApp } from '../../store/app';

export interface Miss {
  id: string;
  de: string;
  en: string;
}

/**
 * Shared quiz mechanics: index/answered/tally, XP + streak via recordSession,
 * misses into Smart Review. One place instead of a copy per mode.
 */
export function useQuizSession(total: number) {
  const recordSession = useApp((s) => s.recordSession);
  const recordMistake = useApp((s) => s.recordMistake);

  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [tally, setTally] = useState({ correct: 0, total: 0, xp: 0 });

  const submit = (correct: boolean, miss?: Miss) => {
    if (answered) return;
    setAnswered(true);
    const xp = recordSession(correct ? 1 : 0, 1);
    setTally((t) => ({ correct: t.correct + (correct ? 1 : 0), total: t.total + 1, xp: t.xp + xp }));
    if (!correct && miss) recordMistake(miss);
    if (navigator.vibrate) navigator.vibrate(correct ? 8 : [4, 30, 4]);
  };

  const advance = () => {
    if (index + 1 >= total) setFinished(true);
    else {
      setIndex((i) => i + 1);
      setAnswered(false);
    }
  };

  const reset = () => {
    setIndex(0);
    setAnswered(false);
    setFinished(false);
    setTally({ correct: 0, total: 0, xp: 0 });
  };

  return { index, answered, finished, tally, submit, advance, reset };
}
