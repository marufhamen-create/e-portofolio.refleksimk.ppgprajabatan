# Portofolio Refleksi Semester I dan II — Maruf Hamen

Website statis siap dipublikasikan untuk tugas Seminar PPG. Isi Semester I dan Semester II berada dalam satu situs, tetapi masing-masing memiliki halaman dan navigasi tersendiri.

## Menjalankan di VS Code
1. Ekstrak folder ini.
2. Buka folder dengan Visual Studio Code.
3. Jalankan `index.html` menggunakan Live Server.

## Publikasi
### GitHub Pages
- Buat repository baru.
- Unggah semua isi folder ini ke root repository.
- Settings → Pages → Deploy from branch → `main` / root.

### Netlify
- Seret folder ini ke Netlify Drop. Tidak memerlukan proses build.

## Catatan logo
Navbar memakai URL logo yang sama/serupa dengan proyek portofolio sebelumnya dan memiliki fallback teks bila gambar eksternal gagal dimuat. Untuk sepenuhnya mandiri, Anda dapat mengganti URL tersebut dengan file logo PNG resmi lokal.

## Struktur penting
- `index.html` — beranda dan pemilih semester.
- `semester-1.html` — halaman khusus Semester I.
- `semester-2.html` — halaman khusus Semester II.
- `assets/css/style.css` — desain responsif.
- `assets/js/app.js` — pemilih semester, tab refleksi, filter artefak, modal PDF, dan navigasi.
- `documents/` — LK 2 serta artefak Semester I.
- `documents/semester-2/` — LK 2 dan artefak Semester II.

## Panel semester
- Panel Semester I memuat enam mata kuliah dan seluruh artefak yang sudah ada.
- Panel Semester II memuat lima mata kuliah: PSE, PMA Lanjut, PPL Mandiri, Projek Kepemimpinan, dan Pendidikan Kepulauan.
- Gunakan tombol Semester I dan Semester II pada beranda untuk membuka halaman masing-masing. Pada navigasi utama, arahkan kursor atau klik tombol semester untuk menampilkan menu Ringkasan, Perjalanan, Refleksi 4C, Artefak, dan Refleksi Akhir.
