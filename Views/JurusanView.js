import Table from "cli-table";
import { centerText } from "./Utils/ViewUtils.js";

export const JurusanView = {
  optMenuJurusan: () => {
    console.log(`\n${centerText("**Menu Jurusan**")}`);
    console.log("[1] Tampilkan Daftar Jurusan");
    console.log("[2] Cari Jurusan");
    console.log("[3] Tambah Jurusan");
    console.log("[4] Hapus Jurusan");
    console.log("[5] Kembali");
  },
  printJurusan: (rows) => {
    const table = new Table({
      head: ["Kode Jurusan", "Nama Jurusan"],
      colWidths: [15, 30],
    });
    rows.forEach((row) => {
      table.push([row.id_jurusan, row.namajurusan]);
    });
    console.log(table.toString());
  },
  printJurusanDetail: (row) => {
    console.log(`ID Jurusan   : ${row.id_jurusan}`);
    console.log(`Nama Jurusan : ${row.namajurusan}`);
  },
  printJurusanAdded: (id) => {
    console.log(`Jurusan dengan ID '${id}' berhasil ditambahkan`);
  },
  printJurusanDeleted: (id) => {
    console.log(`Jurusan dengan ID '${id}' berhasil dihapus`);
  },
  printJurusanNotFound: (id) => {
    console.log(`Jurusan dengan ID '${id}' tidak ditemukan`);
  },
  printInvalidInput: () => {
    console.log("Input tidak valid");
  },
};
