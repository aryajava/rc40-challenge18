import { db } from "./Config/Db.js";

export class KontrakModel {
  static getAll(callback) {
    db.all(
      `SELECT nm.id_nilai, nm.nim, m.nama AS nama_mahasiswa, mk.nama AS nama_matakuliah, d.nama AS nama_dosen, nm.nilai
       FROM nilai_mahasiswa nm
       JOIN mahasiswa m ON nm.nim = m.nim
       JOIN matakuliah mk ON nm.id_matakuliah = mk.id_matakuliah
       JOIN dosen d ON nm.id_dosen = d.id_dosen`,
      (err, rows) => {
        if (err) throw err;
        callback(rows);
      }
    );
  }
  static getByNim(nim, callback) {
    db.all(
      `SELECT nm.id_nilai, nm.nim, nm.id_matakuliah, nm.id_dosen, nm.nilai
       FROM nilai_mahasiswa nm
       WHERE nm.nim = ?`,
      [nim],
      (err, rows) => {
        if (err) throw err;
        callback(rows);
      }
    );
  }
  static getMatakuliahByNim(nim, callback) {
    db.all(
      `SELECT nm.id_nilai, nm.nim, mk.nama AS nama_matakuliah, nm.nilai
       FROM nilai_mahasiswa nm
       JOIN matakuliah mk ON nm.id_matakuliah = mk.id_matakuliah
       WHERE nm.nim = ?`,
      [nim],
      (err, rows) => {
        if (err) throw err;
        callback(rows);
      }
    );
  }
  static add(nim, id_matakuliah, id_dosen, callback) {
    db.run(
      `INSERT INTO nilai_mahasiswa (nim, id_matakuliah, id_dosen) VALUES (?, ?, ?)`,
      [nim, id_matakuliah, id_dosen],
      (err) => {
        if (err) throw err;
        callback();
      }
    );
  }
  static update(id_nilai, nilai, callback) {
    db.run(
      `UPDATE nilai_mahasiswa SET nilai = ? WHERE id_nilai = ?`,
      [nilai, id_nilai],
      function (err) {
        if (err) throw err;
        callback(this.changes);
      }
    );
  }
  static delete(id_nilai, callback) {
    db.run("DELETE FROM nilai_mahasiswa WHERE id_nilai = ?", [id_nilai], function (err) {
      if (err) throw err;
      callback(this.changes);
    });
  }
}
