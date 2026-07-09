import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerRequest } from '../api';
import { useAuth } from '../AuthContext';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await registerRequest(name, email, password, passwordConfirmation);
      login(result.token, result.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrasi gagal.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/40">
        Student Notes AI
      </p>
      <h1 className="mb-6 font-display text-3xl font-bold text-ink">Buat Akun</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border-2 border-ink/20 px-4 py-2.5 outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border-2 border-ink/20 px-4 py-2.5 outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border-2 border-ink/20 px-4 py-2.5 outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Konfirmasi Password</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border-2 border-ink/20 px-4 py-2.5 outline-none focus:border-ink"
          />
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full border-2 border-ink bg-highlighter py-3 font-mono text-sm font-semibold uppercase tracking-wide disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-semibold text-teal underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}