import { JurusanModel } from "../Models/JurusanModel.js";
import { JurusanView } from "../Views/JurusanView.js";
import { MainMenuController } from "./MainMenuController.js";

export const JurusanController = {
  menuJurusan: (rl) => {
    JurusanView.optMenuJurusan();
    rl.question(JurusanView.printQuestion(), (option) => {
      switch (option) {
        case "1":
          JurusanController.getAllJurusan(rl);
          break;
        case "2":
          JurusanController.cariJurusan(rl);
          break;
        case "3":
          JurusanController.tambahJurusan(rl);
          break;
        case "4":
          JurusanController.hapusJurusan(rl);
          break;
        case "5":
          MainMenuController.mainMenu(rl);
          break;
        default:
          JurusanView.printInvalidInput();
          JurusanController.menuJurusan(rl);
      }
    });
  },
  getAllJurusan: (rl) => {
    JurusanModel.getAll((rows) => {
      JurusanView.printJurusan(rows);
      return JurusanController.menuJurusan(rl);
    });
  },
  cariJurusan: (rl) => {
    rl.question("Masukan ID Jurusan: ", (id) => {
      JurusanModel.getById(id, (row) => {
        if (row) {
          console.log(`\nDetail Jurusan dengan ID '${id}':`);
          JurusanView.printJurusanDetail(row);
        } else {
          JurusanView.printJurusanNotFound(id);
        }
        return JurusanController.menuJurusan(rl);
      });
    });
  },
  tambahJurusan: (rl) => {
    JurusanModel.getAll((rows) => {
      JurusanView.printJurusan(rows);
      console.log(`Lengkapi data Jurusan di bawah ini:`);
      const askID = () => {
        rl.question("ID Jurusan: ", (id) => {
          const validID = /^[\d]{1,2}$/;
          if (!validID.test(id)) {
            JurusanView.printInvalidInput();
            return askID();
          }
          if (rows.find((row) => row.id_jurusan === id)) {
            JurusanView.printJurusanExist(id);
            return askID();
          }
          askNama(id);
        });
      };
      const askNama = (id) => {
        rl.question("Nama Jurusan: ", (nama) => {
          const validNama = /^[A-Za-z0-9\s]+$/;
          if (!validNama.test(nama)) {
            JurusanView.printInvalidInput();
            return askNama(id);
          }
          JurusanModel.add(id, nama, () => {
            JurusanView.printJurusanAdded(id);
            return JurusanController.menuJurusan(rl);
          });
        });
      };

      askID();
    });
  },
  hapusJurusan: (rl) => {
    rl.question("Masukan ID Jurusan: ", (id) => {
      JurusanModel.delete(id, (changes) => {
        if (changes > 0) {
          JurusanView.printJurusanDeleted(id);
        } else {
          JurusanView.printJurusanNotFound(id);
        }
        return JurusanController.menuJurusan(rl);
      });
    });
  },
};
