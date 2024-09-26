import { centerText } from "./Utils/ViewUtils.js";

export const MainMenuView = {
  optMainMenu: () => {
    console.log(`\n${centerText("*Menu Utama*")}`);
    console.log("[1] Mahasiswa");
    console.log("[2] Jurusan");
    console.log("[3] Dosen");
    console.log("[4] Mata Kuliah");
    console.log("[5] Kontrak");
    console.log("[6] Keluar");
  }
};
