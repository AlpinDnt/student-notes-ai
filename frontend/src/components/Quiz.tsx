import { useState } from 'react';
import type { QuizQuestion } from '../types';

export function Quiz({
  questions,
  onFinish,
}: {
  questions: QuizQuestion[];
  onFinish: (score: number) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const question = questions[current];
  const isLast = current === questions.length - 1;
  const progress = ((current + (answered ? 1 : 0)) / questions.length) * 100;

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correct_answer_index) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (isLast) {
      onFinish(score);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setAnswered(false);
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <div className="mb-1 flex justify-between font-mono text-xs uppercase tracking-widest text-ink/50">
          <span>Soal {current + 1} / {questions.length}</span>
          <span>Skor: {score}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-highlighter transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h3 className="mb-5 text-xl font-semibold text-ink">{question.question}</h3>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isCorrect = idx === question.correct_answer_index;
          const isSelected = idx === selected;

          let stateClass = 'border-ink/20 hover:border-ink';
          if (answered && isCorrect) stateClass = 'border-teal bg-teal/10';
          else if (answered && isSelected && !isCorrect) stateClass = 'border-coral bg-coral/10';

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={`w-full rounded-lg border-2 p-4 text-left transition ${stateClass}`}
            >
              <span className="mr-2 font-mono text-sm font-bold text-ink/40">
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 rounded-lg bg-ink/5 p-4 text-sm text-ink/80">
          <p className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-teal">
            Penjelasan
          </p>
          <p>{question.explanation}</p>
        </div>
      )}

      {answered && (
        <button
          onClick={handleNext}
          className="mt-6 w-full rounded-full border-2 border-ink bg-highlighter py-3 font-mono text-sm font-semibold uppercase tracking-wide"
        >
          {isLast ? 'Lihat Hasil' : 'Soal Berikutnya →'}
        </button>
      )}
    </div>
  );
}