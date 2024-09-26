import { JurusanModel } from "../Models/JurusanModel.js";
import { MahasiswaModel } from "../Models/MahasiswaModel.js";
import { JurusanView } from "../Views/JurusanView.js";
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
          MahasiswaView.printMahasiswaNotFound(nim);
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
          MahasiswaView.printInvalidInput();
          MahasiswaController.menuMahasiswa(rl);
        }
        rl.question("Nama: ", (nama) => {
          const validNama = /^[A-Za-z\s'.-]+$/;
          if (!validNama.test(nama)) {
            MahasiswaView.printInvalidInput();
            MahasiswaController.menuMahasiswa(rl);
          }
          rl.question("Tanggal Lahir (YYYY-MM-DD): ", (tgllahir) => {
            const validTgl = /^\d{4}-\d{2}-\d{2}$/;
            if (!validTgl.test(tgllahir)) {
              MahasiswaView.printInvalidInput();
              MahasiswaController.menuMahasiswa(rl);
            }
            rl.question("Alamat: ", (alamat) => {
              const validAlamat = /.+/;
              if (!validAlamat.test(alamat)) {
                MahasiswaView.printInvalidInput();
                MahasiswaController.menuMahasiswa(rl);
              }
              JurusanModel.getAll((rows) => {
                JurusanView.printJurusan(rows);
                rl.question("ID Jurusan: ", (id_jurusan) => {
                  MahasiswaModel.add(nim, nama, tgllahir, alamat, id_jurusan, () => {
                    MahasiswaView.printMahasiswaAdded(nim);
                    MahasiswaController.menuMahasiswa(rl);
                  });
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
          MahasiswaView.printMahasiswaDeleted(nim);
        } else {
          MahasiswaView.printMahasiswaNotFound(nim);
        }
        MahasiswaController.menuMahasiswa(rl);
      });
    });
  },
};
