import Table from "cli-table";
import { centerText } from "./Utils/ViewUtils.js";

export const MatakuliahView = {
  optMenuMatakuliah: () => {
    console.log(`\n${centerText("**Menu Matakuliah**")}`);
    console.log("[1] Tampilkan Daftar Matakuliah");
    console.log("[2] Cari Matakuliah");
    console.log("[3] Tambah Matakuliah");
    console.log("[4] Hapus Matakuliah");
    console.log("[5] Kembali");
  },
  printMatakuliah: (rows) => {
    const table = new Table({
      head: ["ID Matakuliah", "Nama Matakuliah", "SKS"],
      colWidths: [15, 30, 5],
    });
    rows.forEach((row) => {
      table.push([row.id_matakuliah, row.nama, row.sks]);
    });
    console.log(table.toString());
  },
  printMatakuliahDetail: (row) => {
    console.log(`ID Matakuliah    : ${row.id_matakuliah}`);
    console.log(`Nama Matakuliah  : ${row.nama}`);
    console.log(`SKS              : ${row.sks}`);
  },
  printMatakuliahAdded: (id) => {
    console.log(`Matakuliah dengan ID '${id}' berhasil ditambahkan`);
  },
  printMatakuliahDeleted: (id) => {
    console.log(`Matakuliah dengan ID '${id}' berhasil dihapus`);
  },
  printMatakuliahNotFound: (id) => {
    console.log(`Matakuliah dengan ID '${id}' tidak ditemukan`);
  },
  printInvalidInput: () => {
    console.log("Input tidak valid");
  },
};
