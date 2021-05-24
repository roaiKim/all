import { Lifecycle, Module, register } from 'core';
import Main from './component';

const initialState = {
  
};

class Game3Module extends Module {
  @Lifecycle()
  onRender() {
    console.log("game3 module action");
  }
}

const module = register(new Game3Module('game3', initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
