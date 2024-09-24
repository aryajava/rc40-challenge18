const readline = require("readline");
const sqlite3 = require("sqlite3").verbose();
const Table = require("cli-table");
const db = new sqlite3.Database("university.db");

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Utility functions
const sparator = (sep = "=", length = 50) => `${sep.repeat(length)}`;
const centerText = (title, length = 50) => {
  const paddingLength = Math.max(0, length - title.length);
  const leftPadding = Math.floor(paddingLength / 2);
  const rightPadding = paddingLength - leftPadding;
  return " ".repeat(leftPadding) + title + " ".repeat(rightPadding);
};

// Database queries
const query = {
  login: (username, callback) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
      if (err) throw err;
      callback(user);
    });
  },
  mahasiswa: {
    getAll: (callback) => {
      db.all(
        `SELECT m.nim, m.nama, m.tgllahir, m.alamat, j.id_jurusan, j.namajurusan
         FROM mahasiswa m
         JOIN jurusan j ON m.id_jurusan = j.id_jurusan`,
        (err, rows) => {
          if (err) throw err;
          callback(rows);
        }
      );
    },
    getByNim: (nim, callback) => {
      db.get(
        `SELECT m.nim, m.nama, m.tgllahir, m.alamat, j.namajurusan
         FROM mahasiswa m
         JOIN jurusan j ON m.id_jurusan = j.id_jurusan
         WHERE m.nim = ?`,
        [nim],
        (err, row) => {
          if (err) throw err;
          callback(row);
        }
      );
    },
    add: (nim, nama, tgllahir, alamat, id_jurusan, callback) => {
      db.run(
        `INSERT INTO mahasiswa (nim, nama, tgllahir, alamat, id_jurusan)
         VALUES (?, ?, ?, ?, ?)`,
        [nim, nama, tgllahir, alamat, id_jurusan],
        (err) => {
          if (err) throw err;
          callback();
        }
      );
    },
    delete: (nim, callback) => {
      db.run("DELETE FROM mahasiswa WHERE nim = ?", [nim], function (err) {
        if (err) throw err;
        callback(this.changes);
      });
    },
  },
  jurusan: {
    getAll: (callback) => {
      db.all("SELECT * FROM jurusan", (err, rows) => {
        if (err) throw err;
        callback(rows);
      });
    },
    getById: (id_jurusan, callback) => {
      db.get(`SELECT * FROM jurusan WHERE id_jurusan = ?`, [id_jurusan], (err, row) => {
        if (err) throw err;
        callback(row);
      });
    },
    add: (id_jurusan, namajurusan, callback) => {
      db.run(
        `INSERT INTO jurusan (id_jurusan, namajurusan) VALUES (?, ?)`,
        [id_jurusan, namajurusan],
        (err) => {
          if (err) throw err;
          callback();
        }
      );
    },
    delete: (id_jurusan, callback) => {
      db.run("DELETE FROM jurusan WHERE id_jurusan = ?", [id_jurusan], function (err) {
        if (err) throw err;
        callback(this.changes);
      });
    },
  },
  dosen: {
    getAll: (callback) => {
      db.all("SELECT * FROM dosen", (err, rows) => {
        if (err) throw err;
        callback(rows);
      });
    },
    getById: (id_dosen, callback) => {
      db.get(`SELECT * FROM dosen WHERE id_dosen = ?`, [id_dosen], (err, row) => {
        if (err) throw err;
        callback(row);
      });
    },
    add: (id_dosen, nama, callback) => {
      db.run(`INSERT INTO dosen (id_dosen, nama) VALUES (?, ?)`, [id_dosen, nama], (err) => {
        if (err) throw err;
        callback();
      });
    },
    delete: (id_dosen, callback) => {
      db.run("DELETE FROM dosen WHERE id_dosen = ?", [id_dosen], function (err) {
        if (err) throw err;
        callback(this.changes);
      });
    },
  },
  matakuliah: {
    getAll: (callback) => {
      db.all("SELECT * FROM matakuliah", (err, rows) => {
        if (err) throw err;
        callback(rows);
      });
    },
    getById: (id_matakuliah, callback) => {
      db.get(`SELECT * FROM matakuliah WHERE id_matakuliah = ?`, [id_matakuliah], (err, row) => {
        if (err) throw err;
        callback(row);
      });
    },
    add: (id_matakuliah, nama, sks, callback) => {
      db.run(
        `INSERT INTO matakuliah (id_matakuliah, nama, sks) VALUES (?, ?, ?)`,
        [id_matakuliah, nama, sks],
        (err) => {
          if (err) throw err;
          callback();
        }
      );
    },
    delete: (id_matakuliah, callback) => {
      db.run("DELETE FROM matakuliah WHERE id_matakuliah = ?", [id_matakuliah], function (err) {
        if (err) throw err;
        callback(this.changes);
      });
    },
  },
  kontrakMatakuliah: {
    getAll: (callback) => {
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
    },
    getById: (nim, callback) => {
      db.get(
        `SELECT nm.id_nilai, nm.nim, nm.id_matakuliah, nm.id_dosen, nm.nilai
         FROM nilai_mahasiswa nm
         WHERE nm.nim = ?`,
        [nim],
        (err, row) => {
          if (err) throw err;
          callback(row);
        }
      );
    },
    add: (nim, id_matakuliah, id_dosen, nilai, callback) => {
      db.run(
        `INSERT INTO nilai_mahasiswa (nim, id_matakuliah, id_dosen, nilai) VALUES (?, ?, ?, ?)`,
        [nim, id_matakuliah, id_dosen, nilai],
        (err) => {
          if (err) throw err;
          callback();
        }
      );
    },
    update: (id_nilai, nim, id_matakuliah, id_dosen, nilai, callback) => {
      db.run(
        `UPDATE nilai_mahasiswa 
       SET nim = ?, id_matakuliah = ?, id_dosen = ?, nilai = ? 
       WHERE id_nilai = ?`,
        [nim, id_matakuliah, id_dosen, nilai, id_nilai],
        function (err) {
          if (err) throw err;
          callback(this.changes);
        }
      );
    },
    delete: (id_nilai, callback) => {
      db.run(
        "DELETE FROM nilai_mahasiswa WHERE id_nilai = ?",
        [id_nilai],
        function (err) {
          if (err) throw err;
          callback(this.changes);
        }
      );
    },
  },
};

// Login function
const login = () => {
  rl.question("Username: ", (username) => {
    query.login(username, (user) => {
      if (!user) {
        console.log("Username tidak terdaftar");
        return login();
      }
      rl.question("Password: ", (password) => {
        if (password === user.password) {
          console.log(
            `${sparator()}\n${centerText("Welcome, " + user.username + ".")}\n${centerText(
              "Your access level is: " + user.role.toUpperCase()
            )}\n${sparator()}`
          );
          mainMenu();
        } else {
          console.log("Password salah");
          login();
        }
      });
    });
  });
};

// Main menu function
const mainMenu = () => {
  console.log(`\n${centerText("*Menu Utama*")}`);
  console.log("[1] Mahasiswa");
  console.log("[2] Jurusan");
  console.log("[3] Dosen");
  console.log("[4] Mata Kuliah");
  console.log("[5] Kontrak");
  console.log("[6] Keluar");

  rl.question("Masukan salah satu nomor dari opsi diatas: ", (option) => {
    switch (option) {
      case "1":
        mahasiswaMenu();
        break;
      case "2":
        jurusanMenu();
        break;
      case "3":
        dosenMenu();
        break;
      case "4":
        matakuliahMenu();
        break;
      case "5":
        kontrakMenu();
        break;
      case "6":
        console.log("Keluar...");
        db.close();
        rl.close();
        process.exit();
      default:
        console.log("Opsi tidak valid");
        mainMenu();
    }
  });
};

// Mahasiswa menu functions
const mahasiswaMenu = () => {
  console.log(`\n${centerText("**Menu Mahasiswa**")}`);
  console.log("[1] Daftar Mahasiswa");
  console.log("[2] Cari Mahasiswa");
  console.log("[3] Tambah Mahasiswa");
  console.log("[4] Hapus Mahasiswa");
  console.log("[5] Kembali");

  rl.question("Masukan salah satu nomor dari opsi diatas: ", (option) => {
    switch (option) {
      case "1":
        daftarMahasiswa();
        break;
      case "2":
        cariMahasiswa();
        break;
      case "3":
        tambahMahasiswa();
        break;
      case "4":
        hapusMahasiswa();
        break;
      case "5":
        mainMenu();
        break;
      default:
        console.log("Opsi tidak valid");
        mahasiswaMenu();
    }
  });
};

const daftarMahasiswa = () => {
  query.mahasiswa.getAll((rows) => {
    const table = new Table({
      head: ["NIM", "Nama", "Tanggal Lahir", "Alamat", "Kode Jurusan", "Nama Jurusan"],
      colWidths: [10, 25, 15, 30, 15, 30],
    });

    rows.forEach((row) => {
      table.push([row.nim, row.nama, row.tgllahir, row.alamat, row.id_jurusan, row.namajurusan]);
    });

    console.log(table.toString());
    mahasiswaMenu();
  });
};

const cariMahasiswa = () => {
  rl.question("Masukan NIM Mahasiswa: ", (nim) => {
    query.mahasiswa.getByNim(nim, (row) => {
      if (!row) {
        console.log(`Mahasiswa dengan NIM '${nim}', tidak terdaftar`);
      } else {
        console.log(`Detail Mahasiswa dengan NIM '${nim}':`);
        console.log(`NIM               : ${row.nim}`);
        console.log(`Nama              : ${row.nama}`);
        console.log(`Tanggal Lahir     : ${row.tgllahir}`);
        console.log(`Alamat            : ${row.alamat}`);
        console.log(`Jurusan           : ${row.namajurusan}`);
      }
      mahasiswaMenu();
    });
  });
};

const tambahMahasiswa = () => {
  query.mahasiswa.getAll((mahasiswaRows) => {
    const tableMahasiswa = new Table({
      head: ["NIM", "Nama", "Tanggal Lahir", "Alamat", "Kode Jurusan", "Nama Jurusan"],
      colWidths: [10, 25, 15, 30, 15, 30],
    });

    mahasiswaRows.forEach((row) => {
      tableMahasiswa.push([
        row.nim,
        row.nama,
        row.tgllahir,
        row.alamat,
        row.id_jurusan,
        row.namajurusan,
      ]);
    });
    console.log(tableMahasiswa.toString());

    rl.question("NIM: ", (nim) => {
      rl.question("Nama: ", (nama) => {
        rl.question("Tanggal Lahir (YYYY-MM-DD): ", (tgllahir) => {
          rl.question("Alamat: ", (alamat) => {
            const validNIM = /^\d+$/;
            const validNama = /^[A-Za-z\s'.-]+$/;
            const validTgl = /^\d{4}-\d{2}-\d{2}$/;
            const validAlamat = /.+/;

            if (!validNIM.test(nim)) {
              console.log("NIM tidak valid.");
              return tambahMahasiswa();
            }
            if (!validNama.test(nama)) {
              console.log("Nama tidak valid.");
              return tambahMahasiswa();
            }
            if (!validTgl.test(tgllahir)) {
              console.log("Tanggal Lahir tidak valid. Harap gunakan format YYYY-MM-DD.");
              return tambahMahasiswa();
            }
            if (!validAlamat.test(alamat)) {
              console.log("Alamat tidak valid.");
              return tambahMahasiswa();
            }

            query.jurusan.getAll((jurusanRows) => {
              const tableJurusan = new Table({
                head: ["Kode Jurusan", "Nama Jurusan"],
                colWidths: [15, 30],
              });
              jurusanRows.forEach((row) => {
                tableJurusan.push([row.id_jurusan, row.namajurusan]);
              });
              console.log(tableJurusan.toString());

              rl.question("Kode Jurusan: ", (id_jurusan) => {
                const validJurusan = jurusanRows.find((j) => j.id_jurusan === id_jurusan);
                if (!validJurusan) {
                  console.log("Kode Jurusan tidak valid, coba lagi.");
                  return tambahMahasiswa();
                }
                query.mahasiswa.add(nim, nama, tgllahir, alamat, id_jurusan, () => {
                  console.log("Mahasiswa telah ditambahkan");
                  daftarMahasiswa();
                });
              });
            });
          });
        });
      });
    });
  });
};

const hapusMahasiswa = () => {
  rl.question("Masukan NIM Mahasiswa: ", (nim) => {
    query.mahasiswa.delete(nim, (changes) => {
      if (changes === 0) {
        console.log(`Mahasiswa dengan NIM '${nim}', tidak terdaftar`);
      } else {
        console.log(`Data Mahasiswa '${nim}', telah dihapus`);
      }
      mahasiswaMenu();
    });
  });
};

// Jurusan menu functions
const jurusanMenu = () => {
  console.log(`\n${centerText("**Menu Jurusan**")}`);
  console.log("[1] Daftar Jurusan");
  console.log("[2] Cari Jurusan");
  console.log("[3] Tambah Jurusan");
  console.log("[4] Hapus Jurusan");
  console.log("[5] Kembali");

  rl.question("Masukan salah satu nomor dari opsi diatas: ", (option) => {
    switch (option) {
      case "1":
        daftarJurusan();
        break;
      case "2":
        cariJurusan();
        break;
      case "3":
        tambahJurusan();
        break;
      case "4":
        hapusJurusan();
        break;
      case "5":
        mainMenu();
        break;
      default:
        console.log("Opsi tidak valid");
        jurusanMenu();
    }
  });
};

const daftarJurusan = () => {
  query.jurusan.getAll((jurusanRows) => {
    const tableJurusan = new Table({
      head: ["Kode Jurusan", "Nama Jurusan"],
      colWidths: [15, 30],
    });
    jurusanRows.forEach((row) => {
      tableJurusan.push([row.id_jurusan, row.namajurusan]);
    });
    console.log(tableJurusan.toString());
    jurusanMenu();
  });
};

const cariJurusan = () => {
  rl.question("Masukan Kode Jurusan: ", (id_jurusan) => {
    query.jurusan.getById(id_jurusan, (row) => {
      if (!row) {
        console.log(`Kode Jurusan '${id_jurusan}', tidak terdaftar`);
      } else {
        console.log(`Detail Jurusan dengan Kode '${id_jurusan}':`);
        console.log(`Kode Jurusan      : ${row.id_jurusan}`);
        console.log(`Nama Jurusan      : ${row.namajurusan}`);
      }
      jurusanMenu();
    });
  });
};

const tambahJurusan = () => {
  query.jurusan.getAll((jurusanRows) => {
    const tableJurusan = new Table({
      head: ["Kode Jurusan", "Nama Jurusan"],
      colWidths: [15, 30],
    });

    jurusanRows.forEach((row) => {
      tableJurusan.push([row.id_jurusan, row.namajurusan]);
    });
    console.log(tableJurusan.toString());

    rl.question("Kode Jurusan: ", (id_jurusan) => {
      rl.question("Nama Jurusan: ", (namajurusan) => {
        const validID = /^[A-Za-z0-9]+$/;
        const validNama = /^[A-Za-z0-9\s]+$/;

        if (!validID.test(id_jurusan)) {
          console.log("Kode Jurusan tidak valid.");
          return tambahJurusan();
        }
        if (!validNama.test(namajurusan)) {
          console.log("Nama Jurusan tidak valid.");
          return tambahJurusan();
        }

        query.jurusan.add(id_jurusan, namajurusan, () => {
          console.log("Jurusan telah ditambahkan");
          daftarJurusan();
        });
      });
    });
  });
};

const hapusJurusan = () => {
  rl.question("Masukan Kode Jurusan: ", (id_jurusan) => {
    query.jurusan.delete(id_jurusan, (changes) => {
      if (changes === 0) {
        console.log(`Jurusan dengan Kode '${id_jurusan}', tidak terdaftar`);
      } else {
        console.log(`Data Jurusan '${id_jurusan}', telah dihapus`);
      }
      jurusanMenu();
    });
  });
};

// Dosen menu functions
const dosenMenu = () => {
  console.log(`\n${centerText("**Menu Dosen**")}`);
  console.log("[1] Daftar Dosen");
  console.log("[2] Cari Dosen");
  console.log("[3] Tambah Dosen");
  console.log("[4] Hapus Dosen");
  console.log("[5] Kembali");

  rl.question("Masukan salah satu nomor dari opsi diatas: ", (option) => {
    switch (option) {
      case "1":
        daftarDosen();
        break;
      case "2":
        cariDosen();
        break;
      case "3":
        tambahDosen();
        break;
      case "4":
        hapusDosen();
        break;
      case "5":
        mainMenu();
        break;
      default:
        console.log("Opsi tidak valid");
        dosenMenu();
    }
  });
};

const daftarDosen = () => {
  query.dosen.getAll((dosenRows) => {
    const tableDosen = new Table({
      head: ["Kode Dosen", "Nama Dosen"],
      colWidths: [15, 30],
    });
    dosenRows.forEach((row) => {
      tableDosen.push([row.id_dosen, row.nama]);
    });
    console.log(tableDosen.toString());
    dosenMenu();
  });
};

const cariDosen = () => {
  rl.question("Masukan Kode Dosen: ", (id_dosen) => {
    query.dosen.getById(id_dosen, (row) => {
      if (!row) {
        console.log(`Kode Dosen '${id_dosen}', tidak terdaftar`);
      } else {
        console.log(`Detail Dosen dengan Kode '${id_dosen}':`);
        console.log(`Kode Dosen      : ${row.id_dosen}`);
        console.log(`Nama Dosen      : ${row.nama}`);
      }
      dosenMenu();
    });
  });
};

const tambahDosen = () => {
  query.dosen.getAll((dosenRows) => {
    const tableDosen = new Table({
      head: ["Kode Dosen", "Nama Dosen"],
      colWidths: [15, 30],
    });

    dosenRows.forEach((row) => {
      tableDosen.push([row.id_dosen, row.nama]);
    });
    console.log(tableDosen.toString());

    rl.question("Kode Dosen: ", (id_dosen) => {
      rl.question("Nama Dosen: ", (nama) => {
        const validID = /^[A-Za-z0-9]+$/;
        const validNama = /^[A-Za-z\s'.-]+$/;

        if (!validID.test(id_dosen)) {
          console.log("Kode Dosen tidak valid.");
          return tambahDosen();
        }
        if (!validNama.test(nama)) {
          console.log("Nama Dosen tidak valid.");
          return tambahDosen();
        }

        query.dosen.add(id_dosen, nama, () => {
          console.log("Dosen telah ditambahkan");
          daftarDosen();
        });
      });
    });
  });
};

const hapusDosen = () => {
  rl.question("Masukan Kode Dosen: ", (id_dosen) => {
    query.dosen.delete(id_dosen, (changes) => {
      if (changes === 0) {
        console.log(`Dosen dengan Kode '${id_dosen}', tidak terdaftar`);
      } else {
        console.log(`Data Dosen '${id_dosen}', telah dihapus`);
      }
      dosenMenu();
    });
  });
};

// Mata Kuliah menu functions
const matakuliahMenu = () => {
  console.log(`\n${centerText("**Menu Mata Kuliah**")}`);
  console.log("[1] Daftar Mata Kuliah");
  console.log("[2] Cari Mata Kuliah");
  console.log("[3] Tambah Mata Kuliah");
  console.log("[4] Hapus Mata Kuliah");
  console.log("[5] Kembali");

  rl.question("Masukan salah satu nomor dari opsi diatas: ", (option) => {
    switch (option) {
      case "1":
        daftarMatakuliah();
        break;
      case "2":
        cariMatakuliah();
        break;
      case "3":
        tambahMatakuliah();
        break;
      case "4":
        hapusMatakuliah();
        break;
      case "5":
        mainMenu();
        break;
      default:
        console.log("Opsi tidak valid");
        matakuliahMenu();
    }
  });
};

const daftarMatakuliah = () => {
  query.matakuliah.getAll((matakuliahRows) => {
    const tableMatakuliah = new Table({
      head: ["Kode Mata Kuliah", "Nama Mata Kuliah", "SKS"],
      colWidths: [15, 30, 5],
    });
    matakuliahRows.forEach((row) => {
      tableMatakuliah.push([row.id_matakuliah, row.nama, row.sks]);
    });
    console.log(tableMatakuliah.toString());
    matakuliahMenu();
  });
};

const cariMatakuliah = () => {
  rl.question("Masukan Kode Mata Kuliah: ", (id_matakuliah) => {
    query.matakuliah.getById(id_matakuliah, (row) => {
      if (!row) {
        console.log(`Kode Mata Kuliah '${id_matakuliah}', tidak terdaftar`);
      } else {
        console.log(`Detail Mata Kuliah dengan Kode '${id_matakuliah}':`);
        console.log(`Kode Mata Kuliah      : ${row.id_matakuliah}`);
        console.log(`Nama Mata Kuliah      : ${row.nama}`);
        console.log(`SKS                   : ${row.sks}`);
      }
      matakuliahMenu();
    });
  });
};

const tambahMatakuliah = () => {
  query.matakuliah.getAll((matakuliahRows) => {
    const tableMatakuliah = new Table({
      head: ["Kode Mata Kuliah", "Nama Mata Kuliah", "SKS"],
      colWidths: [15, 30, 5],
    });

    matakuliahRows.forEach((row) => {
      tableMatakuliah.push([row.id_matakuliah, row.nama, row.sks]);
    });
    console.log(tableMatakuliah.toString());

    rl.question("Kode Mata Kuliah: ", (id_matakuliah) => {
      rl.question("Nama Mata Kuliah: ", (nama) => {
        rl.question("SKS: ", (sks) => {
          const validID = /^[A-Za-z0-9]+$/;
          const validNama = /^[A-Za-z0-9\s'.-]+$/;
          const validSKS = /^\d+$/;

          if (!validID.test(id_matakuliah)) {
            console.log("Kode Mata Kuliah tidak valid.");
            return tambahMatakuliah();
          }
          if (!validNama.test(nama)) {
            console.log("Nama Mata Kuliah tidak valid.");
            return tambahMatakuliah();
          }
          if (!validSKS.test(sks)) {
            console.log("SKS tidak valid.");
            return tambahMatakuliah();
          }

          query.matakuliah.add(id_matakuliah, nama, sks, () => {
            console.log("Mata Kuliah telah ditambahkan");
            daftarMatakuliah();
          });
        });
      });
    });
  });
};

const hapusMatakuliah = () => {
  rl.question("Masukan Kode Mata Kuliah: ", (id_matakuliah) => {
    query.matakuliah.delete(id_matakuliah, (changes) => {
      if (changes === 0) {
        console.log(`Mata Kuliah dengan Kode '${id_matakuliah}', tidak terdaftar`);
      } else {
        console.log(`Data Mata Kuliah '${id_matakuliah}', telah dihapus`);
      }
      matakuliahMenu();
    });
  });
};

// Application entry point
const app = () => {
  console.log(
    `${sparator()}\n${centerText("Welcome to Universitas Pendidikan Indonesia")}\n${centerText(
      "Jl. Setiabudi No. 255"
    )}\n${sparator()}`
  );
  login();
};

app();
