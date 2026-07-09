import { useState } from 'react';
import { fetchQuiz } from '../api';
import type { QuizResponse } from '../types';
import { Quiz } from './Quiz';
import { QuizResult } from './QuizResult';
import { FlashcardDeck } from './FlashcardDeck';
import { SkeletonBlock } from './Skeleton';

type Tab = 'quiz' | 'flashcard';

export function QuizSection({ articleId }: { articleId: number }) {
  const [data, setData] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('quiz');
  const [result, setResult] = useState<number | null>(null);
  const [quizKey, setQuizKey] = useState(0);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchQuiz(articleId);
      setData(res);
    } catch {
      setError('Gagal membuat kuis. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  if (!data && !loading && !error) {
    return (
      <button
        onClick={handleGenerate}
        className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-teal px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide text-paper shadow-[3px_3px_0_0_#1C2321] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#1C2321] active:translate-y-0 active:shadow-none"
      >
        ✎ Uji Pemahaman
      </button>
    );
  }

  return (
    <div className="my-8 w-full rounded-xl border-2 border-ink/10 p-6">
      {loading && (
        <div className="space-y-3">
          <SkeletonBlock className="h-6 w-1/2" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-3/4" />
        </div>
      )}

      {error && (
        <div>
          <p className="text-sm text-coral">{error}</p>
          <button onClick={handleGenerate} className="mt-2 text-sm font-semibold underline">
            Coba lagi
          </button>
        </div>
      )}

      {data && (
        <>
          <div className="mb-6 flex gap-2 border-b border-ink/10 pb-3">
            <button
              onClick={() => setTab('quiz')}
              className={`rounded-full px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide ${
                tab === 'quiz' ? 'bg-ink text-paper' : 'text-ink/50'
              }`}
            >
              Kuis
            </button>
            <button
              onClick={() => setTab('flashcard')}
              className={`rounded-full px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide ${
                tab === 'flashcard' ? 'bg-ink text-paper' : 'text-ink/50'
              }`}
            >
              Flashcard
            </button>
          </div>

          {tab === 'quiz' &&
            (result === null ? (
              <Quiz key={quizKey} questions={data.questions} onFinish={setResult} />
            ) : (
              <QuizResult
                score={result}
                total={data.questions.length}
                onRestart={() => {
                  setResult(null);
                  setQuizKey((k) => k + 1);
                }}
              />
            ))}

          {tab === 'flashcard' && <FlashcardDeck cards={data.flashcards} />}
        </>
      )}
    </div>
  );
}