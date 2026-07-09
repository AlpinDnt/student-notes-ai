import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../api';
import { useAuth } from '../AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await loginRequest(email, password);
      login(result.token, result.user);
      navigate(result.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/40">
        Student Notes AI
      </p>
      <h1 className="mb-6 font-display text-3xl font-bold text-ink">Masuk</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full rounded-lg border-2 border-ink/20 px-4 py-2.5 outline-none focus:border-ink"
          />
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full border-2 border-ink bg-highlighter py-3 font-mono text-sm font-semibold uppercase tracking-wide disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Belum punya akun?{' '}
        <Link to="/register" className="font-semibold text-teal underline">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}