import Table from "cli-table";
import { centerText } from "./Utils/ViewUtils.js";

export const DosenView = {
  optMenuDosen: () => {
    console.log(`\n${centerText("**Menu Dosen**")}`);
    console.log("[1] Tampilkan Daftar Dosen");
    console.log("[2] Cari Dosen");
    console.log("[3] Tambah Dosen");
    console.log("[4] Hapus Dosen");
    console.log("[5] Kembali");
  },
  printQuestion: () => {
    return `Masukkan salah satu nomor dari opsi diatas: `;
  },
  printDosen: (rows) => {
    const table = new Table({
      head: ["ID Dosen", "Nama Dosen"],
      colWidths: [15, 30],
    });
    rows.forEach((row) => {
      table.push([row.id_dosen, row.nama]);
    });
    console.log(table.toString());
  },
  printDosenDetail: (row) => {
    console.log(`ID Dosen   : ${row.id_dosen}`);
    console.log(`Nama Dosen : ${row.nama}`);
  },
  printDosenAdded: (id) => {
    console.log(`Dosen dengan ID '${id}' berhasil ditambahkan`);
  },
  printDosenDeleted: (id) => {
    console.log(`Dosen dengan ID '${id}' berhasil dihapus`);
  },
  printDosenNotFound: (id) => {
    console.log(`Dosen dengan ID '${id}' tidak ditemukan`);
  },
  printDosenExist: (id) => {
    console.log(`Dosen dengan ID '${id}' sudah ada`);
  },
  printInvalidInput: () => {
    console.log("Input tidak valid");
  },
};
