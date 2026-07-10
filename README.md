# Student Notes AI

Platform catatan belajar berbasis AI — upload materi PDF, dapatkan ringkasan **TL;DR** dan **kuis/flashcard interaktif** secara otomatis menggunakan Gemini API.

Student Notes AI dibangun sebagai proyek portofolio yang menggabungkan dua konsep: *AI-Powered Markdown Technical Blog* dan *AI Flashcard & Quiz Generator*. Setiap pengguna bisa mendaftar, meng-upload materi belajar (PDF), lalu AI akan otomatis merangkumnya menjadi catatan terstruktur, ringkasan TL;DR, kuis pilihan ganda, dan flashcard — semuanya disesuaikan secara dinamis dengan panjang materi.

## ✨ Fitur Utama

- **Upload materi PDF** — drag & drop, otomatis diekstrak dan dirangkum jadi catatan belajar terstruktur (bukan sekadar salinan mentah)
- **Ringkasan TL;DR dinamis** — 3–7 poin tergantung panjang materi
- **Kuis interaktif** — 5–15 soal pilihan ganda (menyesuaikan panjang materi), alur satu soal per layar, dengan skor & progress bar
- **Flashcard** — kartu istilah penting dengan animasi flip 3D
- **Sistem akun pribadi** — setiap pengguna memiliki riwayat materinya sendiri yang bersifat privat, tidak bisa dilihat pengguna lain
- **Admin dashboard** — kelola daftar pengguna dan lihat statistik penggunaan
- **Cache hasil AI** — TL;DR dan kuis yang sudah pernah digenerate disimpan di database, tidak boros kuota API untuk materi yang sama

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS (Vite) |
| Backend | Laravel (REST API) |
| Database | MariaDB |
| AI Engine | Google Gemini API (`gemini-2.5-flash`) |
| Autentikasi | Laravel Sanctum (token-based) |
| Ekstraksi PDF | `smalot/pdfparser` |
| Environment | Docker & Docker Compose |

## 🏗️ Arsitektur

```
┌─────────────┐      ┌───────────┐      ┌─────────────┐      ┌──────────┐
│   React     │─────▶│   Nginx   │─────▶│   Laravel   │─────▶│ MariaDB  │
│ (Vite dev)  │      │ (reverse  │      │  (PHP-FPM)  │      │          │
│ :5173       │      │  proxy)   │      │             │      └──────────┘
└─────────────┘      │  :8080    │      └──────┬──────┘
                      └───────────┘             │
                                                 ▼
                                        ┌─────────────────┐
                                        │  Gemini API      │
                                        │ (Google AI       │
                                        │  Studio)         │
                                        └─────────────────┘
```

Setiap layer berjalan di kontainer Docker terpisah (`frontend`, `web`, `app`, `db`), sehingga bisa dijalankan di OS apa pun tanpa konflik versi.

## 🚀 Menjalankan Secara Lokal

### Prasyarat

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) terinstall dan berjalan
- API Key Gemini dari [Google AI Studio](https://aistudio.google.com/) (gratis)

### Langkah instalasi

1. Clone repository ini
   ```bash
   git clone https://github.com/USERNAME_ANDA/student-notes-ai.git
   cd student-notes-ai
   ```

2. Salin file environment
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

3. Isi `backend/.env`, tambahkan API key Gemini Anda:
   ```env
   GEMINI_API_KEY=your_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

4. Build dan jalankan seluruh kontainer
   ```bash
   docker compose up -d --build
   ```

5. Scaffold dependency (khusus setup pertama kali)
   ```bash
   docker compose exec app composer install
   docker compose exec app php artisan key:generate
   docker compose exec app php artisan migrate --seed
   docker compose exec frontend npm install
   ```

6. Buka aplikasi
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8080/api](http://localhost:8080/api)
   - Adminer (GUI database): [http://localhost:8081](http://localhost:8081)

### Akun admin default (dari seeder)

```
Email    : admin@studentnotes.test
Password : password
```

## 📁 Struktur Proyek

```
student-notes-ai/
├── backend/          # Laravel REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   └── Services/GeminiService.php
│   └── routes/api.php
├── frontend/         # React + TypeScript
│   └── src/
│       ├── components/
│       ├── api.ts
│       └── types.ts
├── docker/           # Konfigurasi Nginx & PHP
└── docker-compose.yml
```

## 🔌 API Endpoints

| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| POST | `/api/register` | Daftar akun baru | ❌ |
| POST | `/api/login` | Login, dapat token | ❌ |
| GET | `/api/articles/{id}` | Detail artikel | Kondisional* |
| GET | `/api/articles/{id}/tldr` | Generate/ambil TL;DR | Kondisional* |
| GET | `/api/articles/{id}/quiz` | Generate/ambil kuis & flashcard | Kondisional* |
| POST | `/api/articles/upload` | Upload PDF materi baru | ✅ |
| GET | `/api/my-articles` | Riwayat upload sendiri | ✅ |
| GET | `/api/admin/users` | Daftar semua user (admin) | ✅ (admin) |
| DELETE | `/api/admin/users/{id}` | Hapus user (admin) | ✅ (admin) |

\* *Wajib token jika materi bersifat privat dan bukan milik sendiri.*

## 🧠 Prompt Engineering

Seluruh output AI (ringkasan & kuis) menggunakan fitur **structured output** (`responseSchema`) dari Gemini API, bukan sekadar instruksi teks — memastikan hasil selalu berupa JSON valid yang bisa langsung di-parse tanpa perlu penanganan error parsing tambahan.

## 📄 Lisensi

Proyek ini dibuat untuk keperluan portofolio/pembelajaran.
