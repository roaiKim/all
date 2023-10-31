<script setup lang="ts">
    import { ref, watch, type VNodeRef, watchEffect, onMounted, type Ref } from "vue";
    import SubComponentRef from "../components/subComponentRef.vue"
    import ComponentRef from "../components/componentRef.vue"
    const inputValue = ref("0");
    const subComponentValue = ref(0);
    const toSubClick = () => {
        subComponentValue.value++;
    }
    const toSubClick2 = () => {
        subComponentValue.value = subComponentValue.value+2;
    }

    const tabs  = {
        SubComponentRef,
        ComponentRef
    }

    const currentTab: Ref<keyof typeof tabs>  = ref("SubComponentRef");

    const toggle = (cons: keyof typeof tabs) => {
        //
        console.log("==toggle==", cons);
        currentTab.value = cons;
    }

</script>

<template>
    <input ref="inputRef" v-model="inputValue" /><br/> 
    <SubComponentRef ref="componentRef" :parentInputValue="inputValue">
        
    </SubComponentRef>
    <br/>
    <SubComponentRef ref="componentRef" :parentInputValue="subComponentValue" :hasButton="true" :toSubClick="toSubClick" @toSubClick2="toSubClick2">
        <p style="color: red">天才第一</p>
    </SubComponentRef>
    <br />
    <button @click="currentTab = 'SubComponentRef'">SubComponentRef</button>
    <button @click="currentTab = 'ComponentRef'">ComponentRef</button>
    {{ currentTab }}
    动态组件: 用is来绑定
    <Transition>
        <component :is="tabs[currentTab]"></component>
    </Transition>
    特殊元素只能在特定元素下 比如 table 下只支持 tr、td等 不支持 div 则需要把 tr渲染成 其他自定义组件
    <!-- <code>
        <table>
            <tr is="vue:blog-post-row"></tr>
        </table>
    </code> -->
</template>




