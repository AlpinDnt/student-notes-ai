import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../types';
import { fetchArticles } from '../api';
import { useAuth } from '../AuthContext';
import { SkeletonBlock } from './Skeleton';

export function HomePage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(() => setError('Gagal memuat daftar artikel.'));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/40">
            Student Notes AI
          </p>
          <h1 className="font-display text-4xl font-bold text-ink">Catatan Belajar</h1>
        </div>

        {user ? (
          <Link
            to="/my-articles"
            className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide"
          >
            {user.name}
          </Link>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="rounded-full border-2 border-ink bg-highlighter px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide"
            >
              Daftar
            </Link>
          </div>
        )}
      </div>

      {error && <p className="text-coral">{error}</p>}

      {!articles && !error && (
        <div className="space-y-4">
          <SkeletonBlock className="h-20 w-full" />
          <SkeletonBlock className="h-20 w-full" />
        </div>
      )}

      <div className="space-y-4">
        {articles?.map((article) => (
          <Link
            key={article.id}
            to={`/articles/${article.id}`}
            className="block rounded-xl border-2 border-ink/10 p-5 transition hover:border-ink"
          >
            <h2 className="font-display text-xl font-semibold text-ink">{article.title}</h2>
            {article.excerpt && <p className="mt-1 text-sm text-ink/60">{article.excerpt}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}