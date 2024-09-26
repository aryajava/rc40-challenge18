import { UserModel } from "../Models/UserModel.js";
import { LoginView } from "../Views/LoginView.js";
import { MainMenuController } from "./MainMenuController.js";

export const LoginController = {
  login: (rl) => {
    LoginView.promptUsername(rl, (username) => {
      UserModel.login(username, (user) => {
        if (!user) {
          LoginView.showLoginFailure("Username tidak terdaftar");
          return LoginController.login(rl);
        }
        LoginView.promptPassword(rl, (password) => {
          if (password === user.password) {
            LoginView.showLoginSuccess(user);
            return MainMenuController.mainMenu(rl);
          } else {
            LoginView.showLoginFailure("Password salah");
            return LoginController.login(rl);
          }
        });
      });
    });
  },
};
