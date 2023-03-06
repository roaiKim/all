const { SyncHook } = require("tapable");

// 实例化 tapable
const synchook = new SyncHook(["author", "age"]);

synchook.tap("监控器1", (name, age) => {
    console.log("监控器1",name, age);
});

synchook.tap("监控器2", (name) => {
    console.log("监控器2",name);
});

synchook.tap("监控器3", (name) => {
    console.log("监控器3",name);
});

synchook.tap("监控器4", (name) => {
    console.log("监控器4",name);
});

synchook.call("谁啊", 26);