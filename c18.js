const { log } = require("console");
const readline = require("readline");
const sqlite3 = require("sqlite3").verbose();
const Table = require("cli-table");
const db = new sqlite3.Database("university.db");

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// QUERY LOGIN

// Query untuk login
function queryLogin(username, callback) {
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) throw err;
    callback(user);
  });
}

// QUERY MAHASISWA

// Query untuk menampilkan semua mahasiswa dengan join jurusan
function queryTampilkanSemuaMahasiswa(callback) {
  db.all(
    `SELECT m.nim, m.nama, m.tgllahir, m.alamat, j.id_jurusan, j.namajurusan
     FROM mahasiswa m
     JOIN jurusan j ON m.id_jurusan = j.id_jurusan`,
    (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
      callback(rows);
    }
  );
}

// Query untuk mencari mahasiswa berdasarkan NIM
function queryCariMahasiswa(nim, callback) {
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
}

// Query untuk menambah mahasiswa
function queryTambahMahasiswa(nim, nama, tgllahir, alamat, id_jurusan, callback) {
  db.run(
    `INSERT INTO mahasiswa (nim, nama, tgllahir, alamat, id_jurusan)
     VALUES (?, ?, ?, ?, ?)`,
    [nim, nama, tgllahir, alamat, id_jurusan],
    (err) => {
      if (err) throw err;
      callback();
    }
  );
}

// Query untuk menghapus mahasiswa berdasarkan NIM
function queryHapusMahasiswa(nim, callback) {
  db.run("DELETE FROM mahasiswa WHERE nim = ?", [nim], function (err) {
    if (err) throw err;
    callback(this.changes);
  });
}

// QUERY JURUSAN

// Query untuk select semua jurusan
function queryTampilkanSemuaJurusan(callback) {
  db.all("SELECT * FROM jurusan", (err, rows) => {
    if (err) throw err;
    callback(rows);
  });
}

// Query untuk mencari jurusan berdasarkan Kode Jurusan
function queryCariJurusan(id_jurusan, callback) {
  db.get(
    `SELECT *
     FROM jurusan
     WHERE id_jurusan = ?`,
    [id_jurusan],
    (err, row) => {
      if (err) throw err;
      callback(row);
    }
  );
}

// Query untuk menambah jurusan
function queryTambahJurusan(id_jurusan, namajurusan, callback) {
  db.run(
    `INSERT INTO jurusan (id_jurusan, namajurusan)
     VALUES (?, ?)`,
    [id_jurusan, namajurusan],
    (err) => {
      if (err) throw err;
      callback();
    }
  );
}

// Query untuk menghapus jurusan berdasarkan Kode Jurusan
function queryHapusJurusan(id_jurusan, callback) {
  db.run("DELETE FROM jurusan WHERE id_jurusan = ?", [id_jurusan], function (err) {
    if (err) throw err;
    callback(this.changes);
  });
}

// OTHERS

// Fungsi untuk sparator
const sparator = (sep = "=", length = 50) => {
  return `${sep.repeat(length)}`;
};

// Fungsi untuk text center
function centerText(title, length = 50) {
  const targetLength = length;
  const paddingLength = Math.max(0, targetLength - title.length);
  const leftPadding = Math.floor(paddingLength / 2);
  const rightPadding = paddingLength - leftPadding;

  const centeredTitle = " ".repeat(leftPadding) + title + " ".repeat(rightPadding);
  return centeredTitle;
}

// Fungsi login
function login() {
  rl.question("Username: ", (username) => {
    queryLogin(username, (user) => {
      if (!user) {
        console.log("Username tidak terdaftar");
        login(); // Kembali ke login
      } else {
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
            login(); // Coba login lagi
          }
        });
      }
    });
  });
}

// Fungsi untuk menampilkan menu utama
function mainMenu() {
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
}

// MAHASISWA

// Fungsi untuk menu mahasiswa
function mahasiswaMenu() {
  console.log(`\n${centerText("**Menu Mahasiswa**")}`);
  console.log("[1] Daftar Mahasiswa");
  console.log("[2] Cari Mahasiswa");
  console.log("[3] Tambah Mahasiswa");
  console.log("[4] Hapus Mahasiswa");
  console.log("[5] Kembali");
  rl.question("Masukan salah satu nomor dari opsi diatas: ", (option) => {
    switch (option) {
      case "1":
        console.log(`[1] Daftar Mahasiswa:`);
        daftarMahasiswa();
        break;
      case "2":
        console.log(`[2] Cari Mahasiswa:`);
        cariMahasiswa();
        break;
      case "3":
        console.log(`[3] Tambah Mahasiswa:`);
        tambahMahasiswa();
        break;
      case "4":
        console.log(`[4] Hapus Mahasiswa:`);
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
}

// Fungsi untuk daftar mahasiswa
function daftarMahasiswa() {
  queryTampilkanSemuaMahasiswa((rows) => {
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
}

// Fungsi untuk mencari mahasiswa berdasarkan NIM
function cariMahasiswa() {
  rl.question("Masukan NIM Mahasiswa: ", (nim) => {
    queryCariMahasiswa(nim, (row) => {
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
}

// Fungsi untuk menambah mahasiswa
function tambahMahasiswa() {
  queryTampilkanSemuaMahasiswa((mahasiswaRows) => {
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
            const validNIM = /^\d+$/; // Regular expression for valid NIM
            const validNama = /^[A-Za-z\s]+$/; // Regular expression for valid name (letters and spaces)
            const validTgl = /^\d{4}-\d{2}-\d{2}$/; // Regular expression for valid date (YYYY-MM-DD)
            const validAlamat = /.+/; // Basic validation for non-empty address

            if (!validNIM.test(nim)) {
              console.log("NIM tidak valid.");
              tambahMahasiswa();
            } else if (!validNama.test(nama)) {
              console.log("Nama tidak valid.");
              tambahMahasiswa();
            } else if (!validTgl.test(tgllahir)) {
              console.log("Tanggal Lahir tidak valid. Harap gunakan format YYYY-MM-DD.");
              tambahMahasiswa();
            } else if (!validAlamat.test(alamat)) {
              console.log("Alamat tidak valid.");
              tambahMahasiswa();
            } else {
              // Tampilkan jurusan yang tersedia
              queryTampilkanSemuaJurusan((jurusanRows) => {
                const tableJurusan = new Table({
                  head: ["Kode Jurusan", "Nama Jurusan"],
                  colWidths: [15, 30],
                });
                jurusanRows.forEach((row) => {
                  tableJurusan.push([row.id_jurusan, row.namajurusan]);
                });
                console.log(tableJurusan.toString());

                rl.question("Kode Jurusan: ", (id_jurusan) => {
                  // Validasi jurusan
                  const validJurusan = jurusanRows.find((j) => j.id_jurusan === id_jurusan);
                  if (!validJurusan) {
                    console.log("Kode Jurusan tidak valid, coba lagi.");
                    tambahMahasiswa();
                  } else {
                    queryTambahMahasiswa(nim, nama, tgllahir, alamat, id_jurusan, () => {
                      console.log("Mahasiswa telah ditambahkan");
                      daftarMahasiswa(); // Tampilkan kembali daftar mahasiswa
                    });
                  }
                });
              });
            }
          });
        });
      });
    });
  });
}

// Fungsi untuk menghapus mahasiswa
function hapusMahasiswa() {
  rl.question("Masukan NIM Mahasiswa: ", (nim) => {
    queryHapusMahasiswa(nim, (changes) => {
      if (changes === 0) {
        console.log(`Mahasiswa dengan NIM '${nim}', tidak terdaftar`);
      } else {
        console.log(`Data Mahasiswa '${nim}', telah dihapus`);
      }
      mahasiswaMenu();
    });
  });
}

// JURUSAN

// Fungsi untuk menu jurusan
function jurusanMenu() {
  console.log(`\n${centerText("**Menu Jurusan**")}`);
  console.log("[1] Daftar Jurusan");
  console.log("[2] Cari Jurusan");
  console.log("[3] Tambah Jurusan");
  console.log("[4] Hapus Jurusan");
  console.log("[5] Kembali");
  rl.question("Masukan salah satu nomor dari opsi diatas: ", (option) => {
    switch (option) {
      case "1":
        console.log(`[1] Daftar Jurusan:`);
        daftarJurusan();
        break;
      case "2":
        console.log(`[2] Cari Jurusan:`);
        cariJurusan();
        break;
      case "3":
        console.log(`[3] Tambah Jurusan:`);
        tambahJurusan();
        break;
      case "4":
        console.log(`[4] Hapus Jurusan:`);
        hapusJurusan();
        break;
      case "5":
        mainMenu();
        break;
      default:
        console.log("Opsi tidak valid");
        mahasiswaMenu();
    }
  });
}

// Fungsi untuk daftar jurusan
function daftarJurusan() {
  queryTampilkanSemuaJurusan((jurusanRows) => {
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
}

// Fungsi untuk mencari jurusan berdasarkan Kode Jurusan
function cariJurusan() {
  rl.question("Masukan Kode Jurusan: ", (id_jurusan) => {
    queryCariJurusan(id_jurusan, (row) => {
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
}

// Fungsi untuk menambah jurusan
function tambahJurusan() {
  queryTampilkanSemuaJurusan((jurusanRows) => {
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
          tambahJurusan();
        } else if (!validNama.test(namajurusan)) {
          console.log("Nama Jurusan tidak valid.");
          tambahJurusan();
        } else {
          queryTambahJurusan(id_jurusan, namajurusan, () => {
            console.log("Jurusan telah ditambahkan");
            daftarJurusan();
          });
        }
      });
    });
  });
}

// Fungsi untuk menghapus jurusan
function hapusJurusan() {
  rl.question("Masukan Kode Jurusan: ", (id_jurusan) => {
    queryHapusJurusan(id_jurusan, (changes) => {
      if (changes === 0) {
        console.log(`Jurusan dengan Kode '${id_jurusan}', tidak terdaftar`);
      } else {
        console.log(`Data Jurusan '${id_jurusan}', telah dihapus`);
      }
      jurusanMenu();
    });
  });
}

const app = () => {
  console.log(
    `${sparator()}\n${centerText("Welcome to Universitas Pendidikan Indonesia")}\n${centerText(
      "Jl. Setiabudi No. 255"
    )}\n${sparator()}`
  );
  // Inisialisasi login
  login();
};

app();
