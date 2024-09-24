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
      db.get(
        `SELECT * FROM jurusan WHERE id_jurusan = ?`,
        [id_jurusan],
        (err, row) => {
          if (err) throw err;
          callback(row);
        }
      );
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
      db.get(
        `SELECT * FROM dosen WHERE id_dosen = ?`,
        [id_dosen],
        (err, row) => {
          if (err) throw err;
          callback(row);
        }
      );
    },
    add: (id_dosen, nama, callback) => {
      db.run(
        `INSERT INTO dosen (id_dosen, nama) VALUES (?, ?)`,
        [id_dosen, nama],
        (err) => {
          if (err) throw err;
          callback();
        }
      );
    },
    delete: (id_dosen, callback) => {
      db.run("DELETE FROM dosen WHERE id_dosen = ?", [id_dosen], function (err) {
        if (err) throw err;
        callback(this.changes);
      });
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
            const validNama = /^[A-Za-z\s]+$/;
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
