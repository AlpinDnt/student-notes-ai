import { useState } from 'react';
import { fetchTldr } from '../api';
import type { TldrResponse } from '../types';
import { SkeletonBlock } from './Skeleton';

export function TldrCard({ articleId }: { articleId: number }) {
  const [data, setData] = useState<TldrResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTldr(articleId);
      setData(result);
    } catch {
      setError('Gagal memuat ringkasan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  if (!data && !loading && !error) {
    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-highlighter px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide text-ink shadow-[3px_3px_0_0_#1C2321] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#1C2321] active:translate-y-0 active:shadow-none"
      >
        ✦ Tampilkan TL;DR
      </button>
    );
  }

  return (
    <div className="relative my-2 w-full rounded-lg border-l-4 border-highlighter bg-paper-tint p-5">
      <span className="absolute -top-3 left-4 rounded bg-highlighter px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-ink">
        TL;DR
      </span>

      {loading && (
        <div className="space-y-2 pt-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
          <SkeletonBlock className="h-4 w-2/3" />
        </div>
      )}

      {error && (
        <div className="pt-2">
          <p className="text-sm text-coral">{error}</p>
          <button onClick={handleClick} className="mt-2 text-sm font-semibold underline">
            Coba lagi
          </button>
        </div>
      )}

      {data && (
        <ul className="space-y-2 pt-2">
          {data.summary_points.map((point, i) => (
            <li key={i} className="flex gap-2 text-ink/90">
              <span className="font-mono text-sm font-bold text-teal">{i + 1}.</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}