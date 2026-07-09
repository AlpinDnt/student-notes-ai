import type { Article, QuizResponse, TldrResponse } from './types';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('sna_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request gagal dengan status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function fetchArticles(): Promise<Article[]> {
  return get<Article[]>('/articles');
}

export function fetchMyArticles(): Promise<Article[]> {
  return get<Article[]>('/my-articles');
}

export function fetchArticle(id: number): Promise<Article> {
  return get<Article>(`/articles/${id}`);
}

export function fetchTldr(id: number): Promise<TldrResponse> {
  return get<TldrResponse>(`/articles/${id}/tldr`);
}

export function fetchQuiz(id: number): Promise<QuizResponse> {
  return get<QuizResponse>(`/articles/${id}/quiz`);
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? 'Login gagal.');
  }

  return res.json() as Promise<{
    token: string;
    user: { id: number; name: string; email: string; role: string };
  }>;
}

export async function register(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const firstError = body?.errors ? (Object.values(body.errors)[0] as string[])?.[0] : null;
    throw new Error(firstError ?? body?.message ?? 'Registrasi gagal.');
  }

  return res.json() as Promise<{
    token: string;
    user: { id: number; name: string; email: string; role: string };
  }>;
}

export async function uploadArticle(token: string, title: string, file: File) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/articles/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? 'Upload gagal.');
  }

  return res.json() as Promise<Article>;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  articles_count: number;
}

export interface AdminStats {
  total_users: number;
  total_articles: number;
  articles_today: number;
}

export function fetchAdminUsers(): Promise<AdminUser[]> {
  return get<AdminUser[]>('/admin/users');
}

export function fetchAdminStats(): Promise<AdminStats> {
  return get<AdminStats>('/admin/stats');
}

export async function deleteAdminUser(userId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? 'Gagal menghapus user.');
  }
}