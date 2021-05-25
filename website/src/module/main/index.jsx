import {
  Lifecycle, Loading, Module, register,
} from "core";
import { MainService } from "@api/MainService";
import Main from "./component";

const initialState = {
  user: "ro",
  pathname: null,
  record: null,
  collapsed: localStorage.getItem("COLLAPSED_MENU") === "true",
};

class MainModule extends Module {
  @Lifecycle()
  onRegister() {

    // this.login();
    // this.fetchCurrentUser();
  }

  @Lifecycle()
  onRender() {

    // this.setState({ pathname: location.pathname || '' });
  }

  @Loading("mask")
  async fetchCurrentUser() {
    const response1 = await MainService.getUser().then((response) => {
      console.log("fetchCurrentUser response", response);
      return response;
    }).catch((error) => {
      console.log("fetchCurrentUser error", error);
    });
    console.log("fetchCurrentUser response1", response1);

    /* if (response1.status === 401) {
      this.login();
    } else {
      this.setState({ record: response1.data });
    } */
  }

  @Loading("mask")
  async login() {
    const response = await MainService.login({
      name: "woaini",
      password: "1234",
    });
    console.log("login");
    if (response.code === 0) {
      this.setState({ record: response.data });
    }
  }

  toggleCollapseMenu() {
    const { collapsed } = this.state;
    this.setState({ collapsed: !collapsed });

    // 设置 localStorage
    localStorage.setItem("COLLAPSED_MENU", !collapsed);
  }
}

const module = register(new MainModule("main", initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
