import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Article } from '../types';
import { fetchArticle } from '../api';
import { TldrCard } from './TldrCard';
import { QuizSection } from './QuizSection';
import { SkeletonBlock } from './Skeleton';

export function ArticlePage() {
  const { id } = useParams();
  const articleId = Number(id);
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticle(articleId)
      .then(setArticle)
      .catch(() => setError('Gagal memuat artikel.'));
  }, [articleId]);

  if (error) {
    return <p className="mx-auto max-w-2xl p-6 text-coral">{error}</p>;
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <SkeletonBlock className="h-10 w-3/4" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-2/3" />
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-10">
      <Link to="/" className="mb-4 inline-block font-mono text-xs uppercase tracking-widest text-ink/40">
        ← Kembali
      </Link>
      <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-ink">
        {article.title}
      </h1>

      <div className="mb-4 flex flex-col items-start gap-3">
        <TldrCard articleId={article.id} />
        <QuizSection articleId={article.id} />
      </div>

      <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-ink prose-a:text-teal">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}