# DESIGN.md

# Ruflus Design Guidelines

Dokumen ini menjelaskan prinsip desain antarmuka Ruflus.

Dokumen ini **tidak membahas implementasi**, hanya menjadi acuan ketika membuat halaman, komponen, maupun layout.

---

# Layout

## Penting

Sebelum membuat halaman atau komponen apa pun:

**BACA `CASSAVA.md` TERLEBIH DAHULU.**

`CASSAVA.md` merupakan sumber utama mengenai:

- layout
- spacing
- hierarchy
- page composition
- reusable patterns

Apabila terdapat perbedaan aturan antara dokumen ini dengan `CASSAVA.md`, maka **ikuti CASSAVA.md**.

---

# Navigation

Menggunakan **Bottom Navigation**.

Alasan:

- mudah dijangkau satu tangan
- nyaman digunakan dengan ibu jari
- konsisten pada aplikasi mobile

Navbar selalu berada di bawah.

Navbar muncul pada seluruh halaman utama:

- Dashboard
- Finance
- Split
- Savings
- Bills

Halaman detail tidak wajib menampilkan bottom navigation apabila membutuhkan ruang lebih besar.

---

# Thumb-first Design

Ruflus dirancang sebagai aplikasi mobile.

Seluruh aksi utama harus dapat dilakukan menggunakan ibu jari.

Prioritas penempatan aksi:

- bagian bawah layar
- floating action button
- bottom sheet
- bottom navigation

Hindari aksi penting yang hanya berada di pojok atas layar.

---

# Icons

Gunakan:

- Lucide Icons

Seluruh icon harus berasal dari Lucide agar konsisten.

Jangan mencampur icon pack lain.

Jangan menggunakan emoji sebagai bagian dari antarmuka aplikasi.

---

# Typography

Gunakan:

- Inter

Inter menjadi font utama untuk:

- heading
- body
- caption
- button
- input
- navigation

Jangan menggunakan font dekoratif.

---

# Design Language

Prinsip utama:

- sederhana
- bersih
- mudah dipahami
- fokus pada konten
- minim distraksi

Setiap halaman sebaiknya hanya memiliki satu fokus utama.

---

# Component Consistency

Komponen yang memiliki fungsi sama harus memiliki perilaku yang sama.

Contoh:

- semua card memiliki pola yang konsisten
- semua modal mengikuti struktur yang sama
- semua dialog mengikuti struktur yang sama
- semua form mengikuti pola yang sama

---

# Interaction

Interaksi harus dapat diprediksi.

Contoh:

- tombol utama selalu berada pada posisi yang konsisten
- tombol hapus selalu memerlukan konfirmasi
- edit selalu menggunakan pola yang sama

---

# Empty State

Setiap halaman wajib memiliki Empty State.

Contoh:

- belum ada transaksi
- belum ada target tabungan
- belum ada grup patungan
- belum ada tagihan

Empty State harus membantu pengguna memahami tindakan berikutnya.

---

# Lists

Semua daftar harus mudah dipindai.

Setiap item hanya menampilkan informasi yang benar-benar penting.

Informasi detail ditampilkan pada halaman detail.

---

# Forms

Form dibuat sesingkat mungkin.

Gunakan:

- input yang jelas
- label yang jelas
- validasi sederhana

Hindari form panjang dalam satu layar.

---

# Dialog

Gunakan dialog hanya untuk:

- konfirmasi
- keputusan penting
- aksi destruktif

Untuk input sederhana, utamakan Bottom Sheet.

---

# Accessibility

Pastikan:

- ukuran area sentuh nyaman
- teks mudah dibaca
- icon mudah dikenali
- navigasi mudah dipahami

---

# Responsive

Target utama adalah mobile.

Layout desktop merupakan adaptasi dari layout mobile, bukan sebaliknya.

---

# Visual Consistency

Semua halaman harus terasa berasal dari aplikasi yang sama.

Hindari perubahan pola navigasi, struktur halaman, maupun perilaku komponen antar halaman.

Konsistensi lebih penting daripada variasi visual.
