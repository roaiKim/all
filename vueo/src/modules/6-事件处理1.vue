<script setup lang="ts">
 
    import { reactive, ref, computed } from "vue";
    import SubComs from "./6-事件处理2.vue"
    import SubComs3 from "./6-事件处理3.vue"

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

    const subValue = ref(0);
    const activeUpdate = (step = 1) => {
        subValue.value = subValue.value + step;
    }
    const subInputValue = ref("");
    const subInputValue1 = ref("");
    const subInputValue2 = ref("");

    const customerType = ref("");
</script>

<template>
    <div @active-update="subValue++">
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
        <br/>
        subValue {{ subValue }} <br/>
        <SubComs @active-update="activeUpdate"></SubComs>

        <br/> subInputValue {{ subInputValue }}
        <SubComs v-model="subInputValue"></SubComs>
        
        <br/>
        {{ subInputValue1 }} {{ subInputValue2 }}
        <SubComs v-model:value1="subInputValue1" v-model:value2="subInputValue2"></SubComs>

        <br/><br/>自定义 v-model修饰符
        <SubComs3 v-model:customerType.capitalize="customerType"></SubComs3>
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