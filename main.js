import readline from "readline";
import { centerText, sparator } from "./Views/Utils/ViewUtils.js";
import { LoginController } from "./Controllers/LoginController.js";

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = (rl) => {
  console.log(
    `${sparator()}\n${centerText("Welcome to Universitas Pendidikan Indonesia")}\n${centerText(
      "Jl. Setiabudi No. 255"
    )}\n${sparator()}`
  );
  LoginController.login(rl);
};

app(rl);
