const { SyncHook } = require("tapable");

class Compiler {
    contstructor(){
        this.hooks = {
            run: new SyncHook()
        }
    }
}