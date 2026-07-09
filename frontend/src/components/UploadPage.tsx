import { useState, type FormEvent, type DragEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { uploadArticle } from '../api';
import { useAuth } from '../AuthContext';

export function UploadPage() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileSelected(selected: File | null) {
    if (selected && selected.type !== 'application/pdf') {
      setError('File harus berformat PDF.');
      return;
    }
    setError(null);
    setFile(selected);
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelected(e.dataTransfer.files?.[0] ?? null);
  }

  function handleDragOver(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || !token) return;

    setLoading(true);
    setError(null);
    try {
      const article = await uploadArticle(token, title, file);
      navigate(`/articles/${article.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link to="/" className="mb-1 inline-block font-mono text-xs uppercase tracking-widest text-ink/40">
            ← Kembali ke Catatan Saya
          </Link>
          <h1 className="font-display text-3xl font-bold text-ink">Upload Materi</h1>
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Judul Artikel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Misal: Pengantar Struktur Data"
            className="w-full rounded-lg border-2 border-ink/20 px-4 py-2.5 outline-none focus:border-ink"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">File PDF Materi</label>
          <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
              isDragging ? 'border-teal bg-teal/10' : 'border-ink/30 bg-paper-tint hover:border-ink'
            }`}
          >
            <span className="mb-1 font-mono text-sm font-semibold text-ink">
              {file
                ? file.name
                : isDragging
                ? 'Lepaskan file di sini'
                : 'Seret & lepas PDF di sini, atau klik untuk memilih'}
            </span>
            <span className="text-xs text-ink/50">Maks. 10MB, harus berisi teks (bukan hasil scan)</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileSelected(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </label>
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full rounded-full border-2 border-ink bg-teal py-3 font-mono text-sm font-semibold uppercase tracking-wide text-paper disabled:opacity-50"
        >
          {loading ? 'Merangkum materi dengan AI... (bisa 30-60 detik)' : 'Unggah & Buat Artikel'}
        </button>
      </form>
    </div>
  );
}