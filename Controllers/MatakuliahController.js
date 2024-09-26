import { MatakuliahModel } from "../Models/MatakuliahModel.js";
import { MatakuliahView } from "../Views/MatakuliahView.js";
import { MainMenuController } from "./MainMenuController.js";

export const MatakuliahController = {
  menuMatakuliah: (rl) => {
    MatakuliahView.optMenuMatakuliah();
    rl.question(MatakuliahView.printQuestion(), (option) => {
      switch (option) {
        case "1":
          MatakuliahController.getAllMatakuliah(rl);
          break;
        case "2":
          MatakuliahController.cariMatakuliah(rl);
          break;
        case "3":
          MatakuliahController.tambahMatakuliah(rl);
          break;
        case "4":
          MatakuliahController.hapusMatakuliah(rl);
          break;
        case "5":
          MainMenuController.mainMenu(rl);
          break;
        default:
          MatakuliahView.printInvalidInput();
          MatakuliahController.menuMatakuliah(rl);
      }
    });
  },
  getAllMatakuliah: (rl) => {
    MatakuliahModel.getAll((rows) => {
      MatakuliahView.printMatakuliah(rows);
      return MatakuliahController.menuMatakuliah(rl);
    });
  },
  cariMatakuliah: (rl) => {
    rl.question("Masukan ID Matakuliah: ", (id) => {
      MatakuliahModel.getById(id, (row) => {
        if (row) {
          console.log(`\nDetail Matakuliah dengan ID '${id}':`);
          MatakuliahView.printMatakuliahDetail(row);
        } else {
          MatakuliahView.printMatakuliahNotFound(id);
        }
        return MatakuliahController.menuMatakuliah(rl);
      });
    });
  },

  tambahMatakuliah: (rl) => {
    MatakuliahModel.getAll((rows) => {
      MatakuliahView.printMatakuliah(rows);
      console.log(`Lengkapi data Matakuliah di bawah ini:`);
      const askID = () => {
        rl.question("Masukan ID Matakuliah: ", (id) => {
          const validID = /^[A-Z0-9]+$/;
          if (!validID.test(id)) {
            MatakuliahView.printInvalidInput();
            return askID();
          }
          if (rows.find((row) => row.id_matakuliah === id)) {
            MatakuliahView.printMatakuliahExist(id);
            return askID();
          }
          askNama(id);
        });
      };
      const askNama = (id) => {
        rl.question("Masukan Nama Matakuliah: ", (nama) => {
          const validNama = /^[A-Za-z0-9\s'.-]+$/;
          if (!validNama.test(nama)) {
            MatakuliahView.printInvalidInput();
            return askNama(id);
          }
          if (rows.find((row) => row.nama === nama)) {
            MatakuliahView.printMatakuliahExist(nama);
            return askNama(id);
          }
          askSKS(id, nama);
        });
      };
      const askSKS = (id, nama) => {
        rl.question("SKS: ", (sks) => {
          const validSKS = /^\d{1,1}$/;
          if (!validSKS.test(sks)) {
            MatakuliahView.printInvalidInput();
            return askSKS(id, nama);
          }
          MatakuliahModel.add(id, nama, sks, () => {
            MatakuliahView.printMatakuliahAdded(id);
            return MatakuliahController.menuMatakuliah(rl);
          });
        });
      };
      askID();
    });
  },
  hapusMatakuliah: (rl) => {
    rl.question("Masukan ID Matakuliah: ", (id) => {
      MatakuliahModel.delete(id, (changes) => {
        if (changes > 0) {
          MatakuliahView.printMatakuliahDeleted(id);
        } else {
          MatakuliahView.printMatakuliahNotFound(id);
        }
        return MatakuliahController.menuMatakuliah(rl);
      });
    });
  },
};
