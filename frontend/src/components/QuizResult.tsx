export function QuizResult({
  score,
  total,
  onRestart,
}: {
  score: number;
  total: number;
  onRestart: () => void;
}) {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="mx-auto max-w-md text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-ink/50">Selesai!</p>
      <p className="my-4 text-5xl font-bold text-ink">
        {score}/{total}
      </p>
      <p className="mb-6 text-ink/70">Kamu menjawab benar {percentage}% dari total soal.</p>
      <button
        onClick={onRestart}
        className="rounded-full border-2 border-ink bg-highlighter px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wide"
      >
        Ulangi Kuis
      </button>
    </div>
  );
}