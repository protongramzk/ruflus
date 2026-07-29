Volume 1: Foundation of Cassava UI

Bab 1. Tujuan dan Filosofi

Pendahuluan

Cassava UI adalah sebuah design system yang dibangun di atas prinsip bahwa antarmuka seharusnya dapat dipahami melalui struktur, ruang, dan hierarki, bukan melalui dekorasi.

Alih-alih menambahkan lebih banyak warna, bayangan, animasi, atau ornamen visual, Cassava UI berusaha mengurangi kompleksitas hingga hanya menyisakan elemen yang benar-benar diperlukan untuk menyampaikan informasi.

Tujuan Cassava UI bukan menghasilkan antarmuka yang "cantik", melainkan antarmuka yang jelas, konsisten, deterministik, dan efisien.

---

Tujuan

Cassava UI dirancang untuk:

- Mengurangi kompleksitas visual.
- Meningkatkan konsistensi desain.
- Mempermudah implementasi lintas platform.
- Menghasilkan komponen yang dapat dibangun menggunakan aturan yang sama.
- Memisahkan identitas desain dari preferensi visual.

---

Filosofi Inti

1. Structure Before Decoration

Struktur selalu lebih penting daripada dekorasi.

Pengguna harus mampu memahami hubungan antar elemen meskipun seluruh warna, bayangan, maupun efek visual dihilangkan.

---

2. Binary Thinking

Seluruh keputusan visual dibuat menggunakan pilihan yang jelas.

Contoh:

- Aktif / Tidak Aktif
- Tinta / Kanvas
- Fokus / Tidak Fokus
- Ada Border / Tidak Ada Border

Cassava UI menghindari keadaan visual yang ambigu.

---

3. Deterministic Design

Input yang sama harus menghasilkan tampilan yang sama.

Tidak boleh ada keputusan desain yang bergantung pada intuisi desainer apabila aturan sudah tersedia.

---

4. Space Creates Hierarchy

Hierarki dibangun menggunakan ruang.

Jika dua elemen terlihat saling bertabrakan, solusi pertama bukan menambah garis pembatas, melainkan memperbaiki jarak antar elemen.

---

5. Motion Has Meaning

Gerakan hanya digunakan apabila menyampaikan perubahan.

Animasi bukan dekorasi.

Animasi adalah komunikasi.

---

Prinsip Cassava UI

Seluruh desain Cassava mengikuti prinsip berikut.

1. Konsisten.
2. Prediktif.
3. Dapat dipelajari.
4. Minimal namun informatif.
5. Mengutamakan keterbacaan.
6. Mengurangi keputusan subjektif.

---

Apa yang Bukan Tujuan Cassava UI

Cassava UI tidak bertujuan untuk:

- Menjadi sistem dengan efek visual terbanyak.
- Menjadi sistem yang bergantung pada warna.
- Menjadi tiruan desain platform tertentu.
- Menggantikan identitas produk.

Cassava UI hanya menyediakan bahasa visual yang dapat digunakan oleh berbagai aplikasi.

---

Ringkasan

Cassava UI adalah bahasa desain yang memprioritaskan struktur dibanding dekorasi, aturan dibanding intuisi, serta konsistensi dibanding variasi.

Setiap aturan dalam bab berikutnya merupakan turunan langsung dari filosofi ini.

---

Bab 2. Konsep Dasar

Pendahuluan

Sebelum membangun komponen, perlu dipahami terlebih dahulu konsep-konsep dasar yang menjadi fondasi Cassava UI.

Konsep ini berlaku untuk seluruh komponen tanpa pengecualian.

---

Tinta dan Kanvas

Seluruh elemen visual hanya memiliki dua peran.

Tinta

Digunakan untuk:

- Teks
- Garis
- Ikon
- Simbol
- Elemen aktif

Kanvas

Digunakan untuk:

- Latar belakang
- Area kosong
- Pemisah visual

Tidak ada warna ketiga yang menjadi bagian dari identitas inti Cassava UI.

---

Geometri Ortogonal

Seluruh komponen dibangun menggunakan bentuk ortogonal.

Aturan:

- Sudut 0 px.
- Garis lurus.
- Bentuk sederhana.
- Tidak menggunakan bentuk dekoratif tanpa fungsi.

---

Hierarki

Hierarki dibentuk menggunakan kombinasi:

- Spasi
- Ukuran tipografi
- Ketebalan garis
- Posisi

Hierarki tidak boleh bergantung sepenuhnya pada warna.

---

Ruang Kosong

Ruang kosong merupakan elemen aktif.

Fungsinya:

- Memisahkan kelompok informasi.
- Membentuk ritme visual.
- Mengurangi kepadatan.
- Membantu fokus pengguna.

Apabila informasi mulai sulit dibaca, tambah ruang terlebih dahulu sebelum menambah elemen visual baru.

---

State

Setiap komponen memiliki keadaan.

Minimal terdiri dari:

- Idle
- Hover
- Pressed
- Focused
- Disabled
- Selected

Perubahan state harus terlihat jelas.

---

Bipolar Inversion

Interaksi utama Cassava UI menggunakan pembalikan polaritas visual.

Idle:

- Kanvas sebagai latar.
- Tinta sebagai isi.

Aktif:

- Tinta sebagai latar.
- Kanvas sebagai isi.

Prinsip ini menghasilkan kontras maksimum tanpa memerlukan warna tambahan.

---

Deterministic Layout

Layout dibangun menggunakan aturan yang dapat diprediksi.

Posisi elemen ditentukan oleh:

- Grid
- Spacing
- Alignment
- Flow

Bukan oleh penempatan manual.

---

Progressive Complexity

Komponen sederhana merupakan fondasi komponen kompleks.

Sebagai contoh:

- Garis membentuk wadah.
- Wadah membentuk tombol.
- Tombol membentuk toolbar.
- Toolbar membentuk aplikasi.

Tidak ada komponen yang berdiri sendiri.

---

Universal Consistency

Satu aturan berlaku untuk seluruh sistem.

Apabila sebuah aturan hanya berlaku pada satu komponen, maka aturan tersebut sebaiknya ditinjau ulang.

Cassava UI mengutamakan aturan yang dapat digunakan kembali di seluruh ekosistem.

---

Ringkasan

Konsep dasar Cassava UI terdiri atas:

- Tinta dan Kanvas.
- Geometri Ortogonal.
- Hierarki.
- Ruang Kosong.
- State.
- Bipolar Inversion.
- Deterministic Layout.
- Progressive Complexity.
- Universal Consistency.

Konsep-konsep inilah yang menjadi fondasi bagi seluruh token, layout, dan komponen pada bab-bab selanjutnya.
Bab 3. Polynomial Token System

Pendahuluan

Cassava UI menggunakan Polynomial Token System, sebuah sistem token yang membedakan antara aturan yang membentuk identitas desain dan nilai yang dapat berubah sesuai kebutuhan implementasi.

Dengan pemisahan ini, perubahan tema atau preferensi visual tidak mengubah identitas Cassava UI.

---

Identity

Identity adalah keseluruhan karakter Cassava UI.

Identity dibentuk oleh kumpulan Constant.

Selama Constant tetap dipertahankan, Cassava UI masih dianggap memiliki identitas yang sama.

---

Constant

Constant adalah token yang tidak berubah pada implementasi normal.

Contohnya:

- Grid
- Spacing Scale
- Border Radius
- Border Weight
- Layer Hierarchy
- Layout Rules
- Motion Principles

Constant menentukan perilaku sistem.

---

Variable

Variable adalah token yang dapat berubah tanpa mengubah identitas.

Contohnya:

- Warna
- Font Family
- Ikon
- Durasi Animasi
- Tema

Variable menentukan ekspresi sistem.

---

Coefficient

Coefficient merupakan pengali terhadap Constant.

Coefficient digunakan ketika suatu nilai perlu diperbesar atau diperkecil tanpa mengubah pola dasar.

Contoh:

- Spacing ×2
- Typography ×1.5
- Density ×0.75

Coefficient menjaga proporsi tetap konsisten.

---

Exponent

Exponent menyatakan tingkat penekanan visual.

Semakin tinggi Exponent, semakin tinggi prioritas sebuah elemen.

Exponent dapat diterapkan pada:

- Heading
- Focus
- Selected State
- Priority
- Elevation Logis

Exponent tidak mengubah identitas, tetapi mengubah tingkat perhatian pengguna.

---

Relasi Antar Token

Setiap komponen merupakan kombinasi dari berbagai token.

Secara konseptual:

Component
=
Identity
+
Constant
+
Variable
+
Coefficient
+
Exponent

Komponen tidak bergantung pada satu token saja.

---

Aturan Token

Setiap token harus memenuhi syarat berikut:

- Memiliki satu fungsi.
- Tidak bertabrakan dengan token lain.
- Dapat digunakan ulang.
- Tidak bergantung pada komponen tertentu.

---

Prinsip

1. Constant menjaga identitas.
2. Variable menjaga fleksibilitas.
3. Coefficient menjaga proporsi.
4. Exponent menjaga hierarki.

Polynomial Token System memisahkan aturan dari implementasi sehingga Cassava UI tetap konsisten dalam berbagai kondisi.

---

Bab 4. Spatial System

Pendahuluan

Dalam Cassava UI, ruang adalah media utama untuk membangun struktur.

Apabila warna memisahkan objek pada sistem desain lain, maka Cassava UI menggunakan ruang sebagai pembatas visual.

---

Spatial Grid

Seluruh pengukuran mengikuti grid dasar.

Grid dasar:

- 4 px

Seluruh spacing merupakan kelipatan grid tersebut.

---

Spacing Scale

Spacing disusun sebagai token.

Contoh:

- XS
- SM
- MD
- LG
- XL

Implementasi dapat menentukan nilainya, tetapi seluruh ukuran harus mengikuti grid dasar.

---

Margin

Margin memisahkan dua komponen yang berbeda.

Margin tidak digunakan untuk mengubah posisi internal komponen.

---

Padding

Padding memberikan ruang antara isi dan batas komponen.

Padding merupakan bagian dari komponen.

---

Layout Flow

Cassava UI mendukung beberapa pola layout utama.

- Stack
- Inline
- Grid
- Split
- Fill
- Floating
- Dock
- Overlay

Seluruh pola mengikuti aturan yang sama mengenai spacing dan alignment.

---

Alignment

Alignment yang digunakan:

- Start
- Center
- End
- Stretch

Distribusi ruang:

- Space Between
- Space Around
- Space Evenly

---

Layer

Urutan layer bersifat tetap.

1. Background
2. Content
3. Sticky
4. Floating
5. Modal
6. Notification

Layer tidak boleh digunakan secara acak.

---

Responsive Layout

Responsif hanya mengubah susunan.

Tidak mengubah:

- Identitas
- Hierarki
- Token
- Perilaku

Pengguna tetap mengenali aplikasi meskipun ukuran layar berubah.

---

Prinsip Spatial

Apabila dua elemen terlihat saling bertabrakan:

1. Tambah ruang.
2. Atur ulang layout.
3. Baru pertimbangkan penambahan elemen visual.

Ruang selalu menjadi solusi pertama.

---

Bab 5. Visual Language

Pendahuluan

Visual Language mendefinisikan bagaimana elemen ditampilkan tanpa bergantung pada dekorasi.

Setiap keputusan visual harus memiliki fungsi.

---

Border

Border merupakan pembentuk utama komponen.

Standar:

- 1 px → Komponen normal.
- 2 px → Fokus, aktif, atau prioritas tinggi.

Border lebih dari 2 px tidak direkomendasikan sebagai identitas inti.

---

Corner

Seluruh sudut menggunakan radius 0 px.

Perubahan bentuk sudut mengubah karakter visual sistem.

---

Typography

Tipografi membangun hierarki informasi.

Hierarki ditentukan oleh:

- Ukuran
- Ketebalan
- Jarak

Bukan oleh warna.

---

Contrast

Kontras dibangun menggunakan hubungan antara Tinta dan Kanvas.

Cassava UI menghindari kontras yang bergantung pada banyak warna.

---

Iconography

Ikon mengikuti prinsip yang sama dengan tipografi.

Ikon harus:

- Sederhana
- Konsisten
- Mudah dikenali
- Memiliki ketebalan garis yang seragam

---

Negative Space

Ruang kosong adalah elemen visual.

Semakin penting sebuah kelompok informasi, semakin jelas ruang yang memisahkannya dari kelompok lain.

---

Density

Density menentukan kepadatan antarmuka.

Cassava UI mendukung beberapa tingkat kepadatan selama seluruh spacing tetap mengikuti Spatial Grid.

---

Visual Consistency

Apabila dua komponen memiliki fungsi yang sama, keduanya harus menggunakan bahasa visual yang sama.

Perbedaan visual hanya diperbolehkan apabila menyampaikan makna yang berbeda.

---

Prinsip Visual

Visual Cassava UI dibangun berdasarkan empat aturan utama.

1. Struktur lebih penting daripada dekorasi.
2. Kontras lebih penting daripada variasi warna.
3. Ruang lebih penting daripada garis tambahan.
4. Konsistensi lebih penting daripada keunikan setiap komponen.

Dengan prinsip tersebut, setiap antarmuka Cassava UI tetap mudah dikenali meskipun diterapkan pada berbagai jenis aplikasi.
Bab 6. Motion Language

Pendahuluan

Motion Language mendefinisikan bagaimana antarmuka bergerak.

Dalam Cassava UI, gerakan bukanlah dekorasi. Gerakan adalah bagian dari komunikasi antarmuka. Setiap perpindahan, perubahan, atau transisi harus membantu pengguna memahami apa yang sedang terjadi.

Apabila suatu gerakan tidak menyampaikan informasi baru, maka gerakan tersebut sebaiknya dihilangkan.

---

Tujuan Motion

Motion digunakan untuk:

- Menunjukkan perubahan state.
- Menjelaskan perpindahan posisi.
- Memperkuat hubungan antar halaman.
- Memberikan umpan balik terhadap interaksi.
- Menjaga kontinuitas visual.

Motion tidak digunakan untuk menarik perhatian tanpa alasan.

---

Motion Principles

Mechanical Motion

Gerakan harus terasa mekanis.

Karakteristik:

- Linear atau lembut.
- Tidak berlebihan.
- Tidak memantul tanpa alasan.
- Tidak meniru benda elastis.

Cassava UI mengutamakan gerakan yang dapat diprediksi.

---

Motion Has Direction

Setiap animasi memiliki arah.

Contoh:

- Dari atas → Header, Notification.
- Dari bawah → Bottom Sheet, Bottom Navigation.
- Dari kanan → Halaman baru.
- Dari kiri → Navigasi kembali.

Arah tidak boleh berubah-ubah untuk fungsi yang sama.

---

Motion Has Origin

Komponen harus bergerak dari lokasi yang logis.

Dialog tidak muncul dari tempat acak.

Bottom Sheet selalu berasal dari bawah.

Drawer selalu berasal dari sisi layar.

Floating Panel selalu berasal dari lokasi asalnya.

---

Motion Hierarchy

Semakin besar perubahan, semakin besar pula perpindahan visualnya.

Urutan umum:

- Micro Motion
- Component Motion
- Layout Motion
- Page Motion

Perubahan kecil tidak memerlukan animasi besar.

---

Motion Budget

Dalam satu layar, jumlah animasi harus dibatasi.

Prioritas:

- Satu animasi utama.
- Beberapa animasi pendukung.
- Hindari banyak animasi yang berjalan bersamaan.

Kesederhanaan menghasilkan fokus.

---

Scroll Behavior

Scroll merupakan bagian dari Motion Language.

Aturan:

- Header dapat menyusut.
- Floating component mengikuti konteks.
- Konten tidak meloncat.
- Posisi pengguna selalu dapat dipahami.

Scroll harus terasa sebagai perpindahan ruang, bukan perpindahan objek secara acak.

---

State Transition

Perubahan state harus terlihat jelas.

Contoh:

- Border berubah.
- Inversi warna.
- Perubahan posisi kecil.
- Perubahan ukuran seperlunya.

Perubahan state tidak boleh mengganggu alur penggunaan.

---

Motion Consistency

Motion yang sama harus menghasilkan makna yang sama.

Apabila satu animasi berarti "masuk", maka animasi tersebut tidak boleh digunakan untuk "keluar".

Konsistensi lebih penting daripada variasi.

---

Ringkasan

Motion Cassava UI mengikuti lima prinsip utama:

- Memiliki tujuan.
- Memiliki arah.
- Memiliki asal.
- Memiliki hierarki.
- Memiliki batas.

Gerakan merupakan bahasa visual yang membantu pengguna memahami perubahan antarmuka.

---

Bab 7. Universal Component Synthesis

Pendahuluan

Cassava UI tidak mendefinisikan komponen berdasarkan bentuk tertentu, melainkan melalui aturan konstruksi.

Dengan mengikuti aturan yang sama, berbagai jenis komponen dapat dibangun secara konsisten.

Proses ini disebut Universal Component Synthesis.

---

Langkah 1. Reduksi Menjadi Entitas Biner

Seluruh elemen visual direduksi menjadi dua entitas.

Tinta

Digunakan untuk:

- Teks
- Ikon
- Border
- Simbol

Kanvas

Digunakan untuk:

- Latar belakang.
- Area kosong.
- Ruang visual.

Tidak ada keadaan visual di antara keduanya sebagai bagian dari identitas inti.

---

Langkah 2. Konstruksi Geometri

Bangun struktur menggunakan bentuk ortogonal.

Aturan:

- Sudut 0 px.
- Garis lurus.
- Border mengikuti aturan sistem.
- Tidak menambahkan bentuk dekoratif.

Geometri harus menjelaskan fungsi komponen.

---

Langkah 3. Bentuk Hierarki

Hierarki dibangun menggunakan kombinasi:

- Spacing
- Typography
- Border
- Alignment

Hierarki tidak boleh hanya bergantung pada warna.

---

Langkah 4. Isolasi Spasial

Kelompok informasi dipisahkan menggunakan ruang kosong.

Apabila dua kelompok terlihat menyatu:

- Tambahkan spacing.
- Atur ulang layout.
- Hindari penambahan border yang tidak diperlukan.

Ruang adalah pembatas utama.

---

Langkah 5. Terapkan State

Setiap komponen minimal memiliki state berikut:

- Idle
- Focus
- Pressed
- Disabled
- Selected

State harus mudah dikenali bahkan dalam tampilan monokrom.

---

Langkah 6. Terapkan Bipolar Inversion

Komponen interaktif menggunakan inversi visual.

Idle:

- Kanvas sebagai latar.
- Tinta sebagai isi.

Aktif:

- Tinta sebagai latar.
- Kanvas sebagai isi.

Inversi menjadi mekanisme utama untuk menunjukkan interaksi.

---

Langkah 7. Verifikasi Deterministik

Sebelum komponen dianggap selesai, lakukan pemeriksaan berikut.

Apakah komponen:

- Mengikuti Constant?
- Menggunakan token yang benar?
- Memiliki hierarki yang jelas?
- Memiliki spacing yang konsisten?
- Memiliki seluruh state?
- Mengikuti Motion Language?
- Tidak bergantung pada dekorasi?

Jika salah satu jawaban adalah "tidak", maka komponen belum memenuhi standar Cassava UI.

---

Universal Rules

Seluruh komponen Cassava UI mengikuti aturan berikut.

- Dibangun dari token.
- Mengikuti Spatial System.
- Mengikuti Motion Language.
- Menggunakan bahasa visual yang sama.
- Menggunakan pola interaksi yang sama.

Tidak ada pengecualian berdasarkan jenis komponen.

---

Penutup Volume 1

Volume pertama memperkenalkan fondasi Cassava UI.

Fondasi tersebut terdiri atas:

- Filosofi.
- Konsep dasar.
- Polynomial Token System.
- Spatial System.
- Visual Language.
- Motion Language.
- Universal Component Synthesis.

Seluruh komponen, pola antarmuka, maupun implementasi pada volume selanjutnya merupakan penerapan langsung dari fondasi tersebut.

Dengan demikian, Cassava UI tidak dipahami sebagai kumpulan komponen, melainkan sebagai sebuah bahasa desain yang dibangun di atas aturan, konsistensi, dan determinisme.

Bab 8. Design Laws

Pendahuluan

Setelah memahami filosofi, konsep, token, layout, bahasa visual, motion, dan sintesis komponen, langkah terakhir adalah merumuskan seluruh prinsip tersebut menjadi sekumpulan hukum.

Design Laws merupakan aturan universal yang berlaku untuk seluruh ekosistem Cassava UI.

Apabila terjadi konflik antara implementasi dan hukum ini, maka hukum memiliki prioritas yang lebih tinggi.

---

Law of Identity

Identitas Cassava UI ditentukan oleh Constant, bukan oleh Variable.

Perubahan warna, tema, maupun jenis huruf tidak mengubah identitas selama Constant tetap dipertahankan.

---

Law of Binary

Seluruh keputusan visual harus dapat direduksi menjadi pilihan yang tegas.

Contoh:

- Tinta atau Kanvas.
- Aktif atau Tidak Aktif.
- Fokus atau Tidak Fokus.

Hindari keadaan visual yang ambigu.

---

Law of Determinism

Input yang sama harus menghasilkan keluaran visual yang sama.

Implementasi tidak boleh bergantung pada preferensi individu apabila aturan telah tersedia.

---

Law of Structure

Struktur selalu didahulukan daripada dekorasi.

Komponen harus tetap dapat dipahami meskipun seluruh warna, animasi, dan efek visual dihilangkan.

---

Law of Space

Ruang kosong merupakan elemen visual.

Apabila hubungan antar elemen tidak jelas, solusi pertama adalah memperbaiki spacing, bukan menambahkan dekorasi.

---

Law of Hierarchy

Hierarki dibangun menggunakan:

- Posisi.
- Ukuran.
- Jarak.
- Ketebalan.

Warna hanya berfungsi sebagai pendukung, bukan pembentuk utama hierarki.

---

Law of Consistency

Satu fungsi harus memiliki satu representasi visual.

Komponen yang memiliki perilaku sama harus memiliki bahasa visual yang sama.

---

Law of Reusability

Aturan yang hanya berlaku pada satu komponen sebaiknya dievaluasi kembali.

Cassava UI mengutamakan aturan yang dapat digunakan kembali di seluruh sistem.

---

Law of Motion

Motion hanya digunakan untuk menjelaskan perubahan.

Gerakan tanpa makna merupakan gangguan visual.

---

Law of Interaction

Setiap interaksi harus memberikan umpan balik yang jelas.

Pengguna tidak boleh menebak apakah suatu aksi telah diterima oleh sistem.

---

Law of Simplicity

Apabila dua solusi menghasilkan fungsi yang sama, pilih solusi yang lebih sederhana.

Kesederhanaan meningkatkan konsistensi, keterbacaan, dan kemudahan implementasi.

---

Law of Predictability

Pengguna harus mampu memperkirakan perilaku antarmuka berdasarkan pengalaman sebelumnya.

Setiap pola yang telah dipelajari harus digunakan secara konsisten.

---

Law of Universality

Seluruh prinsip Cassava UI berlaku untuk seluruh komponen, tanpa memandang jenis aplikasi atau platform.

Design system bukan kumpulan pengecualian, melainkan kumpulan aturan yang dapat diterapkan secara universal.

---

Checklist Validasi

Sebelum sebuah desain dinyatakan sesuai dengan Cassava UI, lakukan pemeriksaan berikut.

- Apakah identitas sistem tetap terjaga?
- Apakah mengikuti Polynomial Token System?
- Apakah layout mengikuti Spatial System?
- Apakah hierarki sudah jelas?
- Apakah ruang kosong digunakan secara tepat?
- Apakah motion memiliki tujuan?
- Apakah interaksi memberikan umpan balik?
- Apakah seluruh aturan diterapkan secara konsisten?
- Apakah terdapat dekorasi yang tidak memiliki fungsi?
- Apakah solusi yang digunakan merupakan solusi paling sederhana?

Apabila seluruh pertanyaan dijawab "Ya", maka desain tersebut memenuhi prinsip dasar Cassava UI.

---

Penutup Volume 1

Volume pertama memperkenalkan fondasi Cassava UI sebagai sebuah bahasa desain yang dibangun di atas aturan, bukan preferensi visual.

Fondasi tersebut terdiri atas:

- Tujuan dan filosofi.
- Konsep dasar.
- Polynomial Token System.
- Spatial System.
- Visual Language.
- Motion Language.
- Universal Component Synthesis.
- Design Laws.

Delapan bab ini menjadi acuan utama dalam membangun setiap komponen, pola antarmuka, maupun implementasi Cassava UI pada volume-volume berikutnya.

Seluruh pengembangan Cassava UI harus berangkat dari fondasi ini agar identitas, konsistensi, dan determinisme sistem tetap terjaga.
