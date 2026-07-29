# UI Mapping

## Dashboard

Halaman pertama yang memberikan gambaran kondisi keuangan pengguna.

### Komponen

- Header
    - Sapaan
    - Tanggal hari ini

- Balance Summary
    - Total saldo
    - Total pemasukan bulan ini
    - Total pengeluaran bulan ini

- Savings Overview
    - Daftar target tabungan
    - Progress masing-masing target

- Bills Reminder
    - Tagihan terdekat
    - Jumlah tagihan belum dibayar

- Active Split
    - Daftar patungan yang masih aktif
    - Total piutang
    - Total utang

- Recent Transactions
    - 5–10 transaksi terakhir

---

## Finance

Halaman pencatatan transaksi.

### Komponen

- Transaction Summary
    - Total pemasukan
    - Total pengeluaran
    - Saldo

- Filter
    - Rentang tanggal
    - Kategori
    - Jenis transaksi

- Transaction List

- Floating Action
    - Tambah transaksi

---

## Transaction Detail

Menampilkan detail satu transaksi.

### Komponen

- Informasi transaksi
- Nominal
- Kategori
- Tanggal
- Catatan
- Tombol Edit
- Tombol Hapus

---

## Split

Daftar seluruh grup patungan.

### Komponen

- Active Groups

- Settled Groups

- Floating Action
    - Buat grup

---

## Split Detail

Informasi satu grup patungan.

### Komponen

- Nama grup
- Anggota
- Ringkasan saldo grup

- Expense List

- Settlement Summary
    - Siapa membayar siapa

- Floating Action
    - Tambah pengeluaran

---

## Savings

Daftar target tabungan.

### Komponen

- Goal List

Setiap item berisi:

- Nama target
- Target nominal
- Terkumpul
- Progress

Floating Action:

- Tambah target

---

## Saving Detail

### Komponen

- Informasi target

- Progress

- Riwayat setoran

- Tombol setor

- Tombol edit

---

## Bills

Daftar tagihan.

### Komponen

- Upcoming Bills

- Overdue Bills

- Paid Bills

Floating Action

- Tambah tagihan

---

## Bill Detail

### Komponen

- Nama tagihan

- Nominal

- Jatuh tempo

- Pengulangan

- Status

- Tombol tandai sudah dibayar

---

## Settings

### Komponen

- Profil

- Mata uang

- Backup

- Restore

- Tentang aplikasi

---

# Data Model

## Transaction

Digunakan oleh modul Finance.

```ts
Transaction {
    id
    type
    amount
    categoryId
    accountId
    note
    createdAt
    updatedAt
}
```

type

- income
- expense

---

## Category

```ts
Category {
    id
    name
    icon
    type
}
```

---

## SavingGoal

```ts
SavingGoal {
    id
    name
    targetAmount
    currentAmount
    deadline
    note
    createdAt
}
```

---

## SavingHistory

```ts
SavingHistory {
    id
    goalId
    amount
    note
    createdAt
}
```

---

## SplitGroup

```ts
SplitGroup {
    id
    name
    description
    createdAt
}
```

---

## SplitMember

```ts
SplitMember {
    id
    groupId
    name
}
```

---

## SplitExpense

```ts
SplitExpense {
    id
    groupId
    payerId
    title
    amount
    createdAt
}
```

---

## SplitShare

Menyimpan hasil pembagian biaya.

```ts
SplitShare {
    id
    expenseId
    memberId
    amount
    settled
}
```

---

## Bill

```ts
Bill {
    id
    title
    amount
    dueDate
    repeat
    paid
    note
}
```

repeat

- none
- daily
- weekly
- monthly
- yearly

---

# Hubungan Data

Finance

```
Category
    │
    ▼
Transaction
```

Savings

```
SavingGoal
      │
      ▼
SavingHistory
```

Split

```
SplitGroup
    │
    ├────────────┐
    ▼            ▼
Member      Expense
                 │
                 ▼
               Share
```

Bills

```
Bill
```

---

# Catatan Arsitektur

Setiap modul berdiri sendiri agar mudah dikembangkan. Dashboard hanya membaca dan merangkum data dari modul-modul tersebut tanpa menyimpan data baru.

Semua transaksi bersifat immutable. Jika pengguna mengubah data, sistem memperbarui record yang ada atau membuat histori sesuai kebutuhan di masa depan. Pendekatan ini memudahkan penambahan fitur seperti statistik, sinkronisasi cloud, ekspor data, dan audit perubahan.
