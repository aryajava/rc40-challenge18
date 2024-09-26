import { DosenModel } from "../Models/DosenModel.js";
import { KontrakModel } from "../Models/KontrakModel.js";
import { MahasiswaModel } from "../Models/MahasiswaModel.js";
import { MatakuliahModel } from "../Models/MatakuliahModel.js";
import { DosenView } from "../Views/DosenView.js";
import { KontrakView } from "../Views/KontrakView.js";
import { MahasiswaView } from "../Views/MahasiswaView.js";
import { MatakuliahView } from "../Views/MatakuliahView.js";
import { MainMenuController } from "./MainMenuController.js";

export const KontrakController = {
  menuKontrak: (rl) => {
    KontrakView.optMenuKontrak();
    rl.question(KontrakView.printQuestion(), (option) => {
      switch (option) {
        case "1":
          KontrakController.getAllKontrak(rl);
          break;
        case "2":
          KontrakController.cariKontrak(rl);
          break;
        case "3":
          KontrakController.tambahKontrak(rl);
          break;
        case "4":
          KontrakController.hapusKontrak(rl);
          break;
        case "5":
          KontrakController.updateNilai(rl);
          break;
        case "6":
          MainMenuController.mainMenu(rl);
          break;
        default:
          KontrakView.printInvalidInput();
          KontrakController.menuKontrak(rl);
      }
    });
  },
  getAllKontrak: (rl) => {
    KontrakModel.getAll((rows) => {
      KontrakView.printKontrak(rows);
      return KontrakController.menuKontrak(rl);
    });
  },
  cariKontrak: (rl) => {
    MahasiswaModel.getAll((rows) => {
      MahasiswaView.printMahasiswa(rows);
      rl.question("Masukan NIM: ", (nim) => {
        KontrakModel.getByNim(nim, (rows) => {
          KontrakView.printKontrakDetail(rows);
          return KontrakController.menuKontrak(rl);
        });
      });
    });
  },
  tambahKontrak: (rl) => {
    MahasiswaModel.getAll((rows) => {
      MahasiswaView.printMahasiswa(rows);
      console.log(`Lengkapi data di bawah ini:`);
      const askNIM = () => {
        rl.question("NIM: ", (nim) => {
          const validNIM = /^\d+$/;
          if (!validNIM.test(nim)) {
            KontrakView.printInvalidInput();
            return askNIM();
          }
          if (!rows.find((row) => row.nim === nim)) {
            MahasiswaView.printMahasiswaNotFound(nim);
            return askNIM();
          }
          askIDMatakuliah(nim);
        });
      };
      const askIDMatakuliah = (nim) => {
        MatakuliahModel.getAll((rows) => {
          MatakuliahView.printMatakuliah(rows);
          rl.question("ID Matakuliah: ", (id_matakuliah) => {
            const validIdMk = /^[A-Za-z0-9]+$/;
            if (!validIdMk.test(id_matakuliah)) {
              KontrakView.printInvalidInput();
              return askIDMatakuliah(nim);
            }
            if (!rows.find((row) => row.id_matakuliah === id_matakuliah)) {
              MatakuliahView.printMatakuliahNotFound(id_matakuliah);
              return askIDMatakuliah(nim);
            }
            askIDDosen(nim, id_matakuliah);
          });
        });
      };
      const askIDDosen = (nim, id_matakuliah) => {
        DosenModel.getAll((rows) => {
          DosenView.printDosen(rows);
          rl.question("ID Dosen: ", (id_dosen) => {
            const validIdD = /^[A-Za-z0-9]+$/;
            if (!validIdD.test(id_dosen)) {
              KontrakView.printInvalidInput();
              return askIDDosen(nim, id_matakuliah);
            }
            if (!rows.find((row) => row.id_dosen === id_dosen)) {
              DosenView.printDosenNotFound(id_dosen);
              return askIDDosen(nim, id_matakuliah);
            }
            KontrakModel.add(nim, id_matakuliah, id_dosen, () => {
              KontrakView.printKontrakAdded(id_matakuliah);
              return KontrakController.menuKontrak(rl);
            });
          });
        });
      };
      askNIM();
    });
  },
  hapusKontrak: (rl) => {
    rl.question("Masukan ID Kontrak: ", (id) => {
      KontrakModel.delete(id, (changes) => {
        if (changes > 0) {
          KontrakView.printKontrakDeleted(id);
        } else {
          KontrakView.printKontrakNotFound(id);
        }
        return KontrakController.menuKontrak(rl);
      });
    });
  },
  updateNilai: (rl) => {
    KontrakModel.getAll((rows) => {
      KontrakView.printKontrak(rows);
      rl.question("Masukan NIM Mahasiswa: ", (nim) => {
        if (!rows.find((row) => row.nim === nim)) {
          MahasiswaView.printMahasiswaNotFound(nim);
          return KontrakController.updateNilai(rl);
        }
        KontrakModel.getMatakuliahByNim(nim, (rows) => {
          console.log(`Detail mahasiswa dengan NIM '${nim}':`);
          KontrakView.printNilaiMahasiswa(rows);
          const askID = () => {
            rl.question("Masukan ID yang akan diubah nilainya: ", (id) => {
              const validID = /^\d+$/;
              if (!validID.test(id)) {
                KontrakView.printInvalidInput();
                return askID();
              }
              askNilai(id);
            });
          };
          const askNilai = (id) => {
            rl.question("Tulis nilai yang baru: ", (nilai) => {
              const validNilai = /^[A-Z+-]{1,2}$/;
              if (!validNilai.test(nilai)) {
                KontrakView.printInvalidInput();
                return askNilai(id);
              }
              KontrakModel.update(id, nilai, (changes) => {
                if (changes > 0) {
                  KontrakView.printKontrakUpdated(id);
                } else {
                  KontrakView.printKontrakNotFound(id);
                  KontrakModel.getAll((rows) => {
                    KontrakView.printKontrak(rows);
                  });
                }
                return KontrakController.menuKontrak(rl);
              });
            });
          };
          askID();
        });
      });
    });
  },
};
