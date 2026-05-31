# AuDHD Task Engine (Task Menu Framework)

AuDHD Task Engine adalah sistem manajemen tugas perorangan yang dirancang khusus untuk mengakomodasi cara kerja otak AuDHD (Autism + ADHD). Sistem ini menyeimbangkan dua kebutuhan yang bertolak belakang: struktur data yang sangat ketat dan konsisten di sisi backend (Autistic side) serta fleksibilitas eksekusi yang dinamis dan berbasis dopamine di sisi frontend (ADHD side).

Sistem ini menerapkan konsep **"Task Menu Framework"** alih-alih daftar to-do list linear biasa yang sering memicu *executive dysfunction* dan *choice paralysis*.

---

## 🧠 Konsep & Fitur Utama

### 1. Sisi Autistik: Struktur & Kepastian Data (Backend)
*   **Anti-Vagueness Guardrail (Validasi Input)**: Menolak penambahan tugas baru jika deskripsi *Definition of Done* (DoD) kosong atau di bawah 10 karakter. Ini memaksa otak mendefinisikan tugas secara konkret sejak awal untuk menghindari ambiguitas.
*   **Menu Category (Relasional & Kaku)**: Setiap tugas dikelompokkan secara kaku ke dalam kategori: `APPETIZER` (tugas ringan/pemanasan), `MAIN` (tugas utama/berat), `DESSERT` (tugas kreatif/menyenangkan), atau `SIDE` (tugas ad-hoc tambahan).
*   **Status Lifecycle Kaku**: Tugas hanya boleh berstatus `BACKLOG`, `QUEUE` (sedang masuk menu hari ini), `COMPLETED`, atau `ABANDONED`.

### 2. Sisi ADHD: Fleksibilitas & Dopamine Reward (Frontend)
*   **The Rule of 3 (View Isolation)**: Menyembunyikan seluruh backlog tugas. Sistem hanya menampilkan maksimal 3 tugas aktif berstatus `QUEUE` (1 Appetizer, 1 Main Course, 1 Dessert) berdasarkan level energi saat check-in (`LOW`, `MEDIUM`, `HIGH`).
*   **Boredom Trapdoor (Task Shuffling)**: Jika mandek atau bosan pada tugas utama (`MAIN`), pengguna dapat menekan tombol *shuffle* untuk mengembalikan tugas tersebut ke `BACKLOG` secara otomatis dan menggantinya dengan tugas `DESSERT` yang memiliki `interest_level` tinggi tanpa rasa bersalah (*no guilt*).
*   **Dopamine Hit**: Animasi konfeti instan yang muncul tepat dari kursor mouse saat mengklik centang *Definition of Done* (DoD) untuk memberikan umpan balik kepuasan instan.

---

## 🛠️ Desain Tema Visual: Professional Toolbox / Blueprint Console
Antarmuka frontend menggunakan tema **Professional Toolbox / Blueprint Console** dengan karakteristik:
*   **Blueprint Grid Background**: Latar belakang bermotif cetak biru CAD biru navy gelap.
*   **Tech Panels & Corner Brackets**: Kartu dan kontainer menggunakan siku logam tajam khas panel sasis industri.
*   **Monospace Font**: Menggunakan font bergaya konsol diagnostik untuk memperkuat nuansa instrumen profesional.
*   **Status LED Indicator**: Indikator LED bersinar (*glowing LED*) di tombol daya/energi.
*   **Zero Emojis**: Sepenuhnya bersih dari emoji grafis, digantikan oleh ikon terstruktur dari `lucide-react`.

---

## 📁 Struktur Direktori Proyek

```text
AuDHD-Task-Engine/
├── .vscode/                 # Konfigurasi workspace editor (ignore tailwind warning)
├── db/
│   └── schema.sql           # Skema DDL Database (SQLite / Supabase Postgres)
├── src/
│   ├── services/
│   │   └── TaskEngine.ts    # Logic Engine Status Transition (TypeScript)
│   └── types/
│       └── task.ts          # Definisi Tipe Data Tugas
├── frontend/                # Aplikasi Frontend React + Vite
│   ├── src/
│   │   ├── components/      # UI Components (Atomic Design)
│   │   │   ├── molecules/   # TaskCard.jsx
│   │   │   └── organisms/   # DailyPlate.jsx, EnergyCheckIn.jsx, AddTaskForm.jsx
│   │   ├── lib/
│   │   │   └── supabase.js  # Supabase client connection
│   │   ├── store/
│   │   │   └── useTaskStore.js # State management (Zustand & async Supabase CRUD)
│   │   ├── App.jsx          # Root Component React
│   │   ├── App.css          # Custom styling (Blueprint & Tech-panel classes)
│   │   └── index.css        # Tailwind directives (v4 config)
│   ├── .env                 # Variabel lingkungan Supabase (Aman dari gitignore)
│   └── package.json
└── README.md                # Dokumentasi Proyek
```

---

## ⚙️ Petunjuk Setup & Instalasi

### 1. Database (Supabase)
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/).
2. Salin isi file [db/schema.sql](db/schema.sql) dan jalankan di **SQL Editor** Supabase Anda untuk mencetak tabel `tasks`.
3. Buka menu **Settings ⚙️ -> API** pada dasbor Supabase Anda, lalu salin **Project URL** dan **anon public key**.

### 2. Frontend Environment
1. Masuk ke direktori `frontend/`.
2. Buat file `.env` di dalam folder `frontend/` jika belum ada (file ini diabaikan oleh git demi keamanan).
3. Isi dengan kredensial API Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://<id-proyek-anda>.supabase.co
   VITE_SUPABASE_ANON_KEY=<kunci-anon-public-anda>
   ```

### 3. Menjalankan Aplikasi Secara Lokal
Jalankan perintah berikut di terminal Anda:

```bash
# Masuk ke folder frontend
cd frontend

# Install dependensi (jika baru di-clone)
npm install

# Jalankan development server
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173/`.
