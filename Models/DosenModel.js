import { db } from "./Config/Db.js";

export class DosenModel {
  static getAll(callback) {
    db.all(`SELECT * FROM dosen`, (err, rows) => {
      if (err) throw err;
      callback(rows);
    });
  }
  static getById(id_dosen, callback) {
    db.get(`SELECT * FROM dosen WHERE id_dosen = ?`, [id_dosen], (err, row) => {
      if (err) throw err;
      callback(row);
    });
  }
  static add(id_dosen, nama, callback) {
    db.run(`INSERT INTO dosen (id_dosen, nama) VALUES (?, ?)`, [id_dosen, nama], (err) => {
      if (err) throw err;
      callback();
    });
  }
  static delete(id_dosen, callback) {
    db.run("DELETE FROM dosen WHERE id_dosen = ?", [id_dosen], function (err) {
      if (err) throw err;
      callback(this.changes);
    });
  }
}
