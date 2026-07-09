import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminUsers, fetchAdminStats, deleteAdminUser, type AdminUser, type AdminStats } from '../api';
import { useAuth } from '../AuthContext';
import { SkeletonBlock } from './Skeleton';

export function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function loadData() {
    fetchAdminUsers().then(setUsers).catch(() => setError('Gagal memuat daftar user.'));
    fetchAdminStats().then(setStats).catch(() => {});
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(userId: number) {
    setDeletingId(userId);
    try {
      await deleteAdminUser(userId);
      setUsers((prev) => prev?.filter((u) => u.id !== userId) ?? null);
      setConfirmingId(null);
      fetchAdminStats().then(setStats).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus user.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/40">
            Admin — {user?.name}
          </p>
          <h1 className="font-display text-4xl font-bold text-ink">Kelola Pengguna</h1>
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

      {/* Kartu Statistik */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border-2 border-ink/10 p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Total User</p>
          <p className="mt-1 font-display text-3xl font-bold text-ink">
            {stats ? stats.total_users : '—'}
          </p>
        </div>
        <div className="rounded-xl border-2 border-ink/10 p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Total Materi</p>
          <p className="mt-1 font-display text-3xl font-bold text-ink">
            {stats ? stats.total_articles : '—'}
          </p>
        </div>
        <div className="rounded-xl border-2 border-ink/10 p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Upload Hari Ini</p>
          <p className="mt-1 font-display text-3xl font-bold text-teal">
            {stats ? stats.articles_today : '—'}
          </p>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-coral">{error}</p>}

      {!users && !error && (
        <div className="space-y-3">
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonBlock className="h-16 w-full" />
        </div>
      )}

      {users && users.length === 0 && (
        <p className="rounded-xl border-2 border-dashed border-ink/20 p-8 text-center text-ink/50">
          Belum ada user yang terdaftar.
        </p>
      )}

      {users && users.length > 0 && (
        <div className="overflow-hidden rounded-xl border-2 border-ink/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-tint">
              <tr>
                <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-ink/60">Nama</th>
                <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-ink/60">Email</th>
                <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-ink/60">Materi</th>
                <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-ink/60">Bergabung</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-ink/10">
                  <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                  <td className="px-4 py-3 text-ink/70">{u.email}</td>
                  <td className="px-4 py-3 text-ink/70">{u.articles_count}</td>
                  <td className="px-4 py-3 text-ink/50">
                    {new Date(u.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {confirmingId === u.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-coral">Yakin hapus?</span>
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={deletingId === u.id}
                          className="rounded-full bg-coral px-3 py-1 font-mono text-xs font-semibold text-paper disabled:opacity-50"
                        >
                          {deletingId === u.id ? '...' : 'Ya'}
                        </button>
                        <button
                          onClick={() => setConfirmingId(null)}
                          className="rounded-full border border-ink/20 px-3 py-1 font-mono text-xs font-semibold text-ink/60"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingId(u.id)}
                        className="rounded-full border-2 border-coral px-3 py-1 font-mono text-xs font-semibold text-coral"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}