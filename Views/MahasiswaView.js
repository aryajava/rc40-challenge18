import Table from "cli-table";
import { centerText } from "./Utils/ViewUtils.js";

export const MahasiswaView = {
  optMenuMahasiswa: () => {
    console.log(`\n${centerText("**Menu Mahasiswa**")}`);
    console.log("[1] Tampilkan semua mahasiswa");
    console.log("[2] Cari mahasiswa");
    console.log("[3] Tambah mahasiswa");
    console.log("[4] Hapus mahasiswa");
    console.log("[5] Kembali ke menu utama");
  },
  printMahasiswa: (rows) => {
    const table = new Table({
      head: ["NIM", "Nama", "Tanggal Lahir", "Alamat", "Kode Jurusan", "Nama Jurusan"],
      colWidths: [10, 25, 15, 30, 15, 30],
    });
    rows.forEach((row) => {
      table.push([row.nim, row.nama, row.tgllahir, row.alamat, row.id_jurusan, row.namajurusan]);
    });
    console.log(table.toString());
  },
  printMahasiswaDetail: (data) => {
    console.log(`NIM            : ${data.nim}`);
    console.log(`Nama           : ${data.nama}`);
    console.log(`Tanggal Lahir  : ${data.tgllahir}`);
    console.log(`Alamat         : ${data.alamat}`);
    console.log(`Jurusan        : ${data.namajurusan}`);
  },
  printMahasiswaAdded: (nim) => {
    console.log(`\nMahasiswa dengan NIM ${nim} berhasil ditambahkan`);
  },
  printMahasiswaDeleted: (nim) => {
    console.log(`\nMahasiswa dengan NIM ${nim} berhasil dihapus`);
  },
  printMahasiswaNotFound: (nim) => {
    console.log(`\nMahasiswa dengan NIM ${nim} tidak ditemukan`);
  },
  printInvalidInput: () => {
    console.log("\nInput tidak valid");
  },
  printBackToMainMenu: () => {
    console.log("\nKembali ke menu utama...");
  },
};
