<script setup lang="ts">
 
    import { reactive, ref, computed } from "vue";

    const count = ref(0);
    const inup = () => {
        count.value++
    }
    function warn(message: string, event: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        alert(message);
    }
    function keyu( event: KeyboardEvent) {
        console.log(event);
    }
</script>

<template>
    <div>
        <div>
            <code style="color: red">内联事件{{ count }}</code>
            <button @click="count++">click</button>
        </div>
        <div>
            <code style="color: red">方法事件处理器{{ count }}</code>
            <button @click="inup">click</button>
        </div>
        <div>
            <code style="color: red">在内联事件处理器中访问事件参数 使用特殊的$event变量</code>
            <button @click="warn('how', $event)">click</button>
        </div>
        <div>
            <code style="color: red">在内联事件处理器中访问事件参数 使用箭头函数</code>
            <button @click="(event) => warn('how', event)">click</button>
        </div>
        <div>
            <code style="color: red">时间修饰符  .stop/.prevent/.self/.capture/.once/.passive</code>
            <button @click.once="(event) => warn('how', event)">click</button>
        </div>
        <div>
            <code style="color: red">按键修饰符 @keyup.a 只有按a建才触发</code>
            <input @keyup.a="keyu"/>
        </div>
        <div>
            <code style="color: red">按键修饰符 @keyup.shift.a 只有按shift建的同时按a建才触发</code>
            <input @keyup.shift.a="keyu" />
        </div>
    </div>
</template>

<style>
.author {
    color: red;
}
.active {
    color: red;
}
</style>