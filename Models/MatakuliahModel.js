import { db } from "./Utils/DB.js";

export class MatakuliahModel {
  static getAll(callback) {
    db.all(`SELECT * FROM matakuliah`, (err, rows) => {
      if (err) throw err;
      callback(rows);
    });
  }
  static getById(id_matakuliah, callback) {
    db.get(`SELECT * FROM matakuliah WHERE id_matakuliah = ?`, [id_matakuliah], (err, row) => {
      if (err) throw err;
      callback(row);
    });
  }
  static add(id_matakuliah, nama, sks, callback) {
    db.run(
      `INSERT INTO matakuliah (id_matakuliah, nama, sks) VALUES (?, ?, ?)`,
      [id_matakuliah, nama, sks],
      (err) => {
        if (err) throw err;
        callback();
      }
    );
  }
  static delete(id_matakuliah, callback) {
    db.run("DELETE FROM matakuliah WHERE id_matakuliah = ?", [id_matakuliah], function (err) {
      if (err) throw err;
      callback(this.changes);
    });
  }
}
