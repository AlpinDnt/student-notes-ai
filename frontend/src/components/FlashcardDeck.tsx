import { useState } from 'react';
import type { FlashcardData } from '../types';
import { FlashcardView } from './FlashcardView';

export function FlashcardDeck({ cards }: { cards: FlashcardData[] }) {
  const [index, setIndex] = useState(0);

  return (
    <div>
      <FlashcardView card={cards[index]} index={index} total={cards.length} />
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
          className="rounded-full border-2 border-ink px-4 py-2 font-mono text-sm font-semibold disabled:opacity-30"
        >
          ← Sebelumnya
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(i + 1, cards.length - 1))}
          disabled={index === cards.length - 1}
          className="rounded-full border-2 border-ink bg-highlighter px-4 py-2 font-mono text-sm font-semibold disabled:opacity-30"
        >
          Berikutnya →
        </button>
      </div>
    </div>
  );
}