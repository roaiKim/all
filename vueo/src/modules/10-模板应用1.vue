<script setup lang="ts">
    import { ref, watch, type VNodeRef, watchEffect, onMounted } from "vue";
    import ComponentRef from "../components/componentRef.vue"
    // 访问底层的DOM元素
    const inputRef = ref<VNodeRef | null>(null);
    const inputValue = ref("");
    const componentRef: any = ref(null);
    
    const gggg = ref(componentRef?.value?.inputValue)

    // watch(inputValue, () => {
    //     //
    //     // console.log(inputRef.value?.blur());
    // })

    // watch(() => componentRef?.value?.inputValue, () => {
    //     //
    //     console.log("componentRef", componentRef.value.inputValue);
    // })

    onMounted(() => {
        //
        console.log("--", componentRef.value.inputValue);
    });

    watch(() => componentRef?.value?.inputValue, () => {
        console.log("--gggg--", componentRef?.value?.inputValue);
    })
 

</script>

<template>
    <input ref="inputRef" v-model="inputValue" /><br/>
    {{ componentRef }}
    <ComponentRef ref="componentRef"></ComponentRef>
</template>




