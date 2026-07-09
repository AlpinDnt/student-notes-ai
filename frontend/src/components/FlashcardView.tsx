import { useState } from 'react';
import type { FlashcardData } from '../types';

export function FlashcardView({
  card,
  index,
  total,
}: {
  card: FlashcardData;
  index: number;
  total: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="mb-3 text-center font-mono text-xs uppercase tracking-widest text-ink/50">
        Kartu {index + 1} / {total} — klik untuk membalik
      </p>
      <div
        className="relative h-64 w-full cursor-pointer [perspective:1200px]"
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={`relative h-full w-full rounded-2xl border-2 border-ink shadow-[6px_6px_0_0_#1C2321] transition-transform duration-500 [transform-style:preserve-3d] ${
            flipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-paper-tint p-6 [backface-visibility:hidden]">
            <p className="text-center text-xl font-semibold text-ink">{card.front}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-teal p-6 text-paper [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-center text-base leading-relaxed">{card.back}</p>
          </div>
        </div>
      </div>
    </div>
  );
}