import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Article } from '../types';
import { fetchMyArticles } from '../api';
import { useAuth } from '../AuthContext';
import { SkeletonBlock } from './Skeleton';

export function MyArticlesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyArticles()
      .then(setArticles)
      .catch(() => setError('Gagal memuat riwayat materi.'));
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/40">
            Halo, {user?.name}
          </p>
          <h1 className="font-display text-4xl font-bold text-ink">Catatan Saya</h1>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide"
        >
          Keluar
        </button>
      </div>

      <div className="mb-6">
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-teal px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide text-paper shadow-[3px_3px_0_0_#1C2321] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#1C2321]"
        >
          + Upload Materi Baru
        </Link>
      </div>

      {error && <p className="text-coral">{error}</p>}

      {!articles && !error && (
        <div className="space-y-4">
          <SkeletonBlock className="h-20 w-full" />
          <SkeletonBlock className="h-20 w-full" />
        </div>
      )}

      {articles && articles.length === 0 && (
        <p className="rounded-xl border-2 border-dashed border-ink/20 p-8 text-center text-ink/50">
          Belum ada materi yang di-upload. Klik "Upload Materi Baru" untuk mulai.
        </p>
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