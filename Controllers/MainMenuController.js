import { db } from "../Models/Utils/DB.js";
import { MainMenuView } from "../Views/MainMenuView.js";
import { DosenController } from "./DosenController.js";
import { JurusanController } from "./JurusanController.js";
import { MahasiswaController } from "./MahasiswaController.js";
import { MatakuliahController } from "./MatakuliahController.js";

export const MainMenuController = {
  mainMenu: (rl) => {
    MainMenuView.optMainMenu();
    rl.question("Masukan salah satu nomor dari opsi diatas: ", (option) => {
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
        // case "5":
        //   // Kontrak
        //   MainMenuController.mainMenu(rl);
        //   break;
        case "6":
          console.log("Keluar...");
          db.close();
          rl.close();
          process.exit();
        default:
          console.log("Opsi tidak valid");
          MainMenuController.mainMenu(rl);
      }
    });
  },
};
