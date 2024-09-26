import { DosenModel } from "../Models/DosenModel.js";
import { DosenView } from "../Views/DosenView.js";
import { MainMenuController } from "./MainMenuController.js";

export const DosenController = {
  menuDosen: (rl) => {
    DosenView.optMenuDosen();
    rl.question(DosenView.printQuestion(), (option) => {
      switch (option) {
        case "1":
          DosenController.getAllDosen(rl);
          break;
        case "2":
          DosenController.cariDosen(rl);
          break;
        case "3":
          DosenController.tambahDosen(rl);
          break;
        case "4":
          DosenController.hapusDosen(rl);
          break;
        case "5":
          MainMenuController.mainMenu(rl);
          break;
        default:
          DosenView.printInvalidInput();
          DosenController.menuDosen(rl);
      }
    });
  },
  getAllDosen: (rl) => {
    DosenModel.getAll((rows) => {
      DosenView.printDosen(rows);
      return DosenController.menuDosen(rl);
    });
  },
  cariDosen: (rl) => {
    rl.question("Masukan ID Dosen: ", (id) => {
      DosenModel.getById(id, (row) => {
        if (row) {
          console.log(`\nDetail Dosen dengan ID '${id}':`);
          DosenView.printDosenDetail(row);
        } else {
          DosenView.printDosenNotFound(id);
        }
        return DosenController.menuDosen(rl);
      });
    });
  },
  tambahDosen: (rl) => {
    DosenModel.getAll((rows) => {
      DosenView.printDosen(rows);
      console.log(`Lengkapi data Dosen di bawah ini:`);
      const askID = () => {
        rl.question("Masukan ID Dosen: ", (id) => {
          const validID = /^[A-Z0-9]+$/;
          if (!validID.test(id)) {
            DosenView.printInvalidInput();
            return askID();
          }
          if (rows.find((row) => row.id_dosesn === id)) {
            DosenView.printDosenExist(id);
            return askID();
          }
          askNama(id);
        });
      };
      const askNama = (id) => {
        rl.question("Masukan Nama Dosen: ", (nama) => {
          const validNama = /^[A-Za-z\s'.-]+$/;
          if (!validNama.test(nama)) {
            DosenView.printInvalidInput();
            return askNama(id);
          }
          DosenModel.add(id, nama, () => {
            DosenView.printDosenAdded(id);
            return DosenController.menuDosen(rl);
          });
        });
      };
      askID();
    });
  },
  hapusDosen: (rl) => {
    rl.question("Masukan ID Dosen: ", (id) => {
      DosenModel.delete(id, (changes) => {
        if (changes > 0) {
          DosenView.printDosenDeleted(id);
        } else {
          DosenView.printDosenNotFound(id);
        }
        return DosenController.menuDosen(rl);
      });
    });
  },
};
