import { MainMenuController } from "../Controllers/MainMenuController.js";
import { centerText, sparator } from "./Utils/ViewUtils.js";

export const LoginView = {
    promptUsername: (rl, callback) => {
      rl.question("Username: ", (username) => {
        callback(username);
      });
    },
  
    promptPassword: (rl, callback) => {
      rl.question("Password: ", (password) => {
        callback(password);
      });
    },
  
    showLoginSuccess: (user) => {
      console.log(
        `${sparator()}\n${centerText("Welcome, " + user.username + ".")}\n${centerText(
          "Your access level is: " + user.role.toUpperCase()
        )}\n${sparator()}`
      );
    },
  
    showLoginFailure: (message) => {
      console.log(message);
    }
  };
  
  export default LoginView;

const loginView = (rl) => {
    rl.question("Username: ", (username) => {
      query.login(username, (user) => {
        if (!user) {
          console.log("Username tidak terdaftar");
          return loginView();
        }
        rl.question("Password: ", (password) => {
          if (password === user.password) {
            console.log(
              `${sparator()}\n${centerText("Welcome, " + user.username + ".")}\n${centerText(
                "Your access level is: " + user.role.toUpperCase()
              )}\n${sparator()}`
            );
            mainMenu();
          } else {
            console.log("Password salah");
            loginView();
          }
        });
      });
    });
  };