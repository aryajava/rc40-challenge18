import { MahasiswaModel } from "../Models/MahasiswaModel.js";
import { MahasiswaView } from "../Views/MahasiswaView.js";
import { MainMenuController } from "./MainMenuController.js";

export const MahasiswaController = {
  menuMahasiswa: (rl) => {
    MahasiswaView.optMenuMahasiswa();
    rl.question("Masukan salah satu nomor dari opsi diatas: ", (option) => {
      switch (option) {
        case "1":
          MahasiswaController.getAllMahasiswa(rl);
          break;
        case "2":
          MahasiswaController.cariMahasiswa(rl);
          break;
        case "3":
          MahasiswaController.tambahMahasiswa(rl);
          break;
        case "4":
          MahasiswaController.hapusMahasiswa(rl);
          break;
        case "5":
          MainMenuController.mainMenu(rl);
          break;
        default:
          console.log("Opsi tidak valid");
          MahasiswaController.menuMahasiswa(rl);
      }
    });
  },
  getAllMahasiswa: (rl) => {
    MahasiswaModel.getAll((rows) => {
      MahasiswaView.printMahasiswa(rows);
      MahasiswaController.menuMahasiswa(rl);
    });
  },
  cariMahasiswa: (rl) => {
    rl.question("Masukan NIM: ", (nim) => {
      MahasiswaModel.getByNim(nim, (row) => {
        if (row) {
          console.log(`\nDetail Mahasiswa dengan NIM '${nim}':`);
          MahasiswaView.printMahasiswaDetail(row);
        } else {
          console.log("Mahasiswa tidak ditemukan");
        }
        MahasiswaController.menuMahasiswa(rl);
      });
    });
  },
  tambahMahasiswa: (rl) => {
    MahasiswaModel.getAll((rows) => {
      MahasiswaView.printMahasiswa(rows);
      console.log(`Lengkapi data Mahasiswa di bawah ini:`);
      rl.question("NIM: ", (nim) => {
        const validNIM = /^\d+$/;
        if (!validNIM.test(nim)) {
          console.log("NIM tidak valid.");
          MahasiswaController.menuMahasiswa(rl);
        }
        rl.question("Nama: ", (nama) => {
          const validNama = /^[A-Za-z\s'.-]+$/;
          if (!validNama.test(nama)) {
            console.log("Nama tidak valid.");
            MahasiswaController.menuMahasiswa(rl);
          }
          rl.question("Tanggal Lahir (YYYY-MM-DD): ", (tgllahir) => {
            const validTgl = /^\d{4}-\d{2}-\d{2}$/;
            if (!validTgl.test(tgllahir)) {
              console.log("Tanggal Lahir tidak valid. Harap gunakan format YYYY-MM-DD.");
              MahasiswaController.menuMahasiswa(rl);
            }
            rl.question("Alamat: ", (alamat) => {
              const validAlamat = /.+/;
              if (!validAlamat.test(alamat)) {
                console.log("Alamat tidak valid.");
                MahasiswaController.menuMahasiswa(rl);
              }
              rl.question("ID Jurusan: ", (id_jurusan) => {
                MahasiswaModel.add(nim, nama, tgllahir, alamat, id_jurusan, () => {
                  console.log("Mahasiswa berhasil ditambahkan");
                  MahasiswaController.menuMahasiswa(rl);
                });
              });
            });
          });
        });
      });
    });
  },
  hapusMahasiswa: (rl) => {
    rl.question("Masukan NIM: ", (nim) => {
      MahasiswaModel.delete(nim, (changes) => {
        if (changes > 0) {
          console.log(`Mahasiswa dengan NIM: ${nim}, berhasil dihapus`);
        } else {
          console.log(`Mahasiswa dengan NIM ${nim}, tidak ditemukan`);
        }
      });
    });
  },
};
