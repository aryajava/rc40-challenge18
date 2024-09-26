import { db } from "../Models/Config/Db.js";
import { MainMenuView } from "../Views/MainMenuView.js";
import { DosenController } from "./DosenController.js";
import { JurusanController } from "./JurusanController.js";
import { KontrakController } from "./KontrakController.js";
import { MahasiswaController } from "./MahasiswaController.js";
import { MatakuliahController } from "./MatakuliahController.js";

export const MainMenuController = {
  mainMenu: (rl) => {
    MainMenuView.optMainMenu();
    rl.question(MainMenuView.printQuestion(), (option) => {
      switch (option) {
        case "1":
          MahasiswaController.menuMahasiswa(rl);
          break;
        case "2":
          JurusanController.menuJurusan(rl);
          break;
        case "3":
          DosenController.menuDosen(rl);
          break;
        case "4":
          MatakuliahController.menuMatakuliah(rl);
          break;
        case "5":
          KontrakController.menuKontrak(rl);
          break;
        case "6":
          MainMenuView.printExit();
          db.close();
          rl.close();
          process.exit();
        default:
          MainMenuView.printInvalidInput();
          MainMenuController.mainMenu(rl);
      }
    });
  },
};
