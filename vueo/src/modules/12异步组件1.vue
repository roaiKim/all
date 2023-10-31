<script setup lang="ts">
    import { ref, watch, type VNodeRef, watchEffect, onMounted, type Ref, defineAsyncComponent } from "vue";
    import SubComponentRef from "../components/subComponentRef.vue"
    import ComponentRef from "../components/componentRef.vue"

    const AsyncComponent = defineAsyncComponent(() => {
        return import(/* ccrr */"./12异步组件2.vue");
    });

    const subComponentValue = ref(0);

    const tabs  = {
        SubComponentRef,
        ComponentRef: AsyncComponent
    }

    const currentTab: Ref<keyof typeof tabs>  = ref("SubComponentRef");

</script>

<template>
    <br />
    <button @click="currentTab = 'SubComponentRef'">SubComponentRef</button>
    <button @click="currentTab = 'ComponentRef'">ComponentRef</button>
    {{ currentTab }}
    动态组件: 用is来绑定
    <component :is="tabs[currentTab]"></component>
</template>




