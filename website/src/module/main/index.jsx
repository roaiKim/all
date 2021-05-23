import { Lifecycle, Loading, Module, register } from 'core';
import { MainService } from "@api/MainService";
import Main from './component';

const initialState = {
  user: "ro",
  pathname: null,
  record: null,
  collapsed: localStorage.getItem("COLLAPSED_MENU") === "true"
};

class MainModule extends Module {
  @Lifecycle()
  onRegister() {
    this.login();
    this.fetchCurrentUser();
  }

  @Lifecycle()
  onRender(routeParameters, location) {
    // this.setState({ pathname: location.pathname || '' });
  }

  @Loading('mask')
  async fetchCurrentUser() {
    const response = await MainService.getUser();
    if (response.code === 0) {
      this.setState({ record: response.data });
    }
  }

  @Loading('mask')
  async login() {
    const response = await MainService.login();
    if (response.code === 0) {
      this.setState({ record: response.data });
    }
  }

  async toggleCollapseMenu() {
    const collapsed = this.state.collapsed;
    this.setState({ collapsed: !collapsed });
    // 设置 localStorage
    localStorage.setItem("COLLAPSED_MENU", !collapsed)
  }
}

const module = register(new MainModule('main', initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
