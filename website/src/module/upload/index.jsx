import { Lifecycle, Module, register } from 'core';
import Main from './component';

const initialState = {
  
};

class UploadModule extends Module {
  @Lifecycle()
  onRender() {
    console.log("upload module action");
  }
}

const module = register(new UploadModule('upload', initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
