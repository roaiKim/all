import { Lifecycle, Loading, Module, register } from 'core';
import { MainService } from "@api/MainService";
import Main from './component';

const initialState = {
  user: "ro",
  pathname: null,
  record: null,
  collapsed: true
};

class MainModule extends Module {
  @Lifecycle()
  onRegister() {
    this.fetchCurrentUser();
  }

  @Lifecycle()
  onRender(routeParameters, location) {
    // this.setState({ pathname: location.pathname || '' });
  }

  @Loading('mask')
  async fetchCurrentUser() {
    const response = await MainService.getOrder({"limit":10,"phone":"15899999999","pageSize":10,"pageNo":1,"offset":0,"orderNumber":null});
    if (response.code === 0) {
      this.setState({ record: response.data });
    }
  }

  async toggleCollapseMenu() {
    const collapsed = this.state.collapsed
    this.setState({ collapsed: !collapsed });
  }
}

const module = register(new MainModule('main', initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);