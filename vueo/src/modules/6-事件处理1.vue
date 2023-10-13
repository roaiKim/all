<script setup lang="ts">
 
    import { reactive, ref, computed } from "vue";

    const count = ref(0);
    const inup = () => {
        count.value++
    }
</script>

<template>
    
    <div>
        <code style="color: red">内联事件{{ count }}</code>
        <button @click="count++">click</button>
    </div>
    <div>
        <code style="color: red">方法事件处理器{{ count }}</code>
        <button @click="inup">click</button>
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