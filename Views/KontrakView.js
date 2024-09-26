import Table from "cli-table";
import { centerText } from "./Utils/ViewUtils.js";

export const KontrakView = {
  optMenuKontrak: () => {
    console.log(`\n${centerText("**Menu Kontrak**")}`);
    console.log("[1] Daftar Kontrak");
    console.log("[2] Cari Kontrak");
    console.log("[3] Tambah Kontrak");
    console.log("[4] Hapus Kontrak");
    console.log("[5] Update Nilai");
    console.log("[6] Kembali");
  },
  printQuestion: () => {
    return `Masukkan salah satu nomor dari opsi diatas: `;
  },
  printKontrak: (rows) => {
    const table = new Table({
      head: ["ID", "NIM", "Nama", "Mata Kuliah", "Dosen", "Nilai"],
      colWidths: [5, 10, 30, 30, 30, 10],
    });
    rows.forEach((row) => {
      table.push([
        row.id_nilai,
        row.nim,
        row.nama_mahasiswa,
        row.nama_matakuliah,
        row.nama_dosen,
        row.nilai != null ? row.nilai : "",
      ]);
    });
    console.log(table.toString());
  },
  printKontrakDetail: (rows) => {
    const table = new Table({
      head: ["ID", "NIM", "Kode Matakuliah", "Kode Dosen", "Nilai"],
      colWidths: [5, 10, 20, 15, 10],
    });
    rows.forEach((row) => {
      table.push([
        row.id_nilai,
        row.nim,
        row.id_matakuliah,
        row.id_dosen,
        row.nilai != null ? row.nilai : "",
      ]);
    });
    console.log(table.toString());
  },
  printNilaiMahasiswa: (rows) => {
    const table = new Table({
      head: ["ID", "Nama Mata Kuliah", "Nilai"],
      colWidths: [5, 20, 10],
    });
    rows.forEach((row) => {
      table.push([row.id_nilai, row.nama_matakuliah, row.nilai != null ? row.nilai : ""]);
    });
    console.log(table.toString());
  },
  printKontrakAdded: (id) => {
    console.log(`Kontrak dengan ID '${id}' berhasil ditambahkan`);
  },
  printKontrakUpdated: (id) => {
    console.log(`Kontrak dengan ID '${id}' berhasil diupdate`);
  },
  printKontrakDeleted: (id) => {
    console.log(`Kontrak dengan ID '${id}' berhasil dihapus`);
  },
  printKontrakNotFound: (id) => {
    console.log(`Kontrak dengan ID '${id}' tidak ditemukan`);
  },
  printInvalidInput: () => {
    console.log("Input tidak valid");
  },
};
